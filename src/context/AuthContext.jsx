import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
// import { fetchSocialHubDataAndCallBackend } from "../services/socialhubAuth";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
const AuthContext = createContext(null);
import { getWorkspaceByAccountId, getWorkspaceAccessCode } from "../services/workspaceServices";
import { getChannelsByWorkspaceId } from "../services/newsFeedsChannelServices";
import { getUserByProviderId, upsertUser, getFormattedUserData } from "../services/userServices";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [currentUserUsers, setCurrentUserUsers] = useState([]);
  const [currentUserTeams, setCurrentUserTeams] = useState([]);
  const [currentUserChannels, setCurrentUserChannels] = useState([]);
  const [workSpaceNotCreated, setWorkSpaceNotCreated] = useState(false);
  const [workSpace, setWorkSpace] = useState(null);
  const [feedsChannels, setFeedsChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLinkedInAuth = async (workspaceId) => {
    try {
      setIsLoading(true);
      
      // Get the current authenticated user from Supabase
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();
      
      if (getUserError || !user) {
        throw new Error("Failed to get authenticated user");
      }
      
      setAuthUser(user);
      
      // Extract LinkedIn profile data
      let firstName = user.user_metadata?.full_name?.split(' ')[0] || "";
      let lastName = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "";
      const avatarUrl = user.user_metadata?.avatar_url || "";
      const email = user.email;
      const providerUserId = user.id;
      
      // Check if user exists in our database
      const { data: existingUser, error: userError } = await getUserByProviderId(providerUserId);
      
      // Insert or update user data
      const { data: upsertedUser, error: upsertError } = await upsertUser(
        {
          email,
          firstName,
          lastName,
          avatarUrl,
          providerUserId
        },
        workspaceId
      );
      
      if (upsertError) throw upsertError;
      
      // Get formatted user data
      const { userData, error: formattedError } = await getFormattedUserData(providerUserId);
      if (formattedError) throw formattedError;
      
      // Set the user in context
      setCurrentUser(userData);
      
      // Fetch workspace data if we have workspaceId
      if (workspaceId) {
        const { error, workspace: ws } = await getWorkspaceByAccountId(workspaceId);
        if (!ws && error?.code === "PGRST116") {
          setWorkSpaceNotCreated(true);
        } else {
          setWorkSpace(ws);
          const channels = await getChannelsByWorkspaceId(ws.id);
          if (channels) {
            setFeedsChannels(channels);
          }
        }
      }
      
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("LinkedIn auth error:", error);
      return { success: false, error };
    } 
  };

  const getDataAndToken = async () => {
    const jwtResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/userDataSocialHub`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      }
    );

    if (jwtResponse.ok) {
      const apiResponse = await jwtResponse.json();
      console.log("from jwt and all data development: ", apiResponse);

      const token = apiResponse.token;
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });
      // console.log(await supabase.auth.getProviders())

      // Set Supabase authenticated user from API response.
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError) {
        console.error("getUser error:", getUserError);
        return;
      }

      setAuthUser(user);

      setCurrentUser({
        ...apiResponse.userInfo,
        userName: `${apiResponse.userInfo.firstName.replace(
          /\s+/g,
          ""
        )}_${apiResponse.userInfo.lastName.replace(/\s+/g, "")}`,
      });

      setCurrentUserTeams(apiResponse.userTeams);

      const updatedUsers = apiResponse.userUsers.map((user) => {
        const firstNameClean = user.firstName.replace(/\s+/g, "");
        const lastNameClean = user.lastName.replace(/\s+/g, "");
        return {
          ...user,
          userName: `${firstNameClean}_${lastNameClean}`,
        };
      });

      const { error, workspace: ws } = await getWorkspaceByAccountId(
        apiResponse.userInfo.accountId
      );
      if (!ws && error?.code === "PGRST116") {
        setWorkSpaceNotCreated(true);
      } else {
        // Fetch workspace access code
        const { accessCode, error: accessCodeError } = await getWorkspaceAccessCode(ws.id);
        if (!accessCodeError) {
          ws.access_code = accessCode;
        }

        setWorkSpace(ws);
        // now you know `user` and `ws` exist
        const { data: dbUser, error: userError } = await supabase
          .from("users")
          .select("workspace_id")
          .eq("id", user.id)
          .single();
      
        if (!userError) {
          if (!dbUser.workspace_id || dbUser.workspace_id !== ws.id) {
            try {
              const { data, error } = await supabase.functions.invoke('update-user-workspace', {
                body: {
                  userId: user.id,
                  workspaceId: ws.id,
                },
              });
        
              if (error) {
                console.error("❌ Error updating user's workspace:", error);
              } else {
                console.log("✅ User workspace updated:", data);
              }
            } catch (err) {
              console.error("❌ Failed to invoke Edge Function:", err);
            }
          }
        } else {
          setWorkSpaceNotCreated(true);
          console.error("Error fetching workspace_id:", userError);
        }
        const channels = await getChannelsByWorkspaceId(ws.id);
        if (channels) {
          setFeedsChannels(channels);
        } else {
          console.error("Error fetching channels for workspace:", error);
        }
      }

      setCurrentUserUsers(updatedUsers);
      setCurrentUserChannels(apiResponse.userChannels);
      setIsAuthenticated(true);
    
    } else {
      jwtResponse.status === 403
        ? console.error("Access forbidden: You do not have admin privileges.")
        : console.error("Failed to generate JWT");
      
    }
  };

  const getToken = async () => {
    try {
      const apiResponse = await fetchSocialHubDataAndCallBackend();
      console.log("from jwt and all data production: ", apiResponse);

      const token = apiResponse.userInfo.sbToken;
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      // Set Supabase authenticated user from API response.
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError) {
        console.error("getUser error:", getUserError);
        return;
      }
      setAuthUser(user);

    
      setCurrentUser({
        ...apiResponse.userInfo,
        userName: `${apiResponse.userInfo.firstName}_${apiResponse.userInfo.lastName}`,
        email_preferance: emailPreferance,
      });

      setCurrentUserTeams(apiResponse.userTeams);

      const updatedUsers = apiResponse.userUsers.map((user) => {
        const firstNameClean = user.firstName.replace(/\s+/g, "");
        const lastNameClean = user.lastName.replace(/\s+/g, "");
        return {
          ...user,
          userName: `${firstNameClean}_${lastNameClean}`,
        };
      });
      
      setCurrentUserUsers(updatedUsers);
      setCurrentUserChannels(apiResponse.userChannels);

      const { error, workspace: ws } = await getWorkspaceByAccountId(
        apiResponse.userInfo.accountId
      );
      if (!ws && error?.code === "PGRST116") {
        setWorkSpaceNotCreated(true);
      } else {
        // Fetch workspace access code
        const { accessCode, error: accessCodeError } = await getWorkspaceAccessCode(ws.id);
        if (!accessCodeError) {
          ws.access_code = accessCode;
        }

        setWorkSpace(ws);
        // now you know `user` and `ws` exist
        const { data: dbUser, error: userError } = await supabase
          .from("users")
          .select("workspace_id")
          .eq("id", user.id)
          .single();
      
        if (!userError) {
          if (!dbUser.workspace_id || dbUser.workspace_id !== ws.id) {
            try {
              const { data, error } = await supabase.functions.invoke('update-user-workspace', {
                body: {
                  userId: user.id,
                  workspaceId: ws.id,
                },
              });
        
              if (error) {
                console.error("❌ Error updating user's workspace:", error);
              } else {
                console.log("✅ User workspace updated:", data);
              }
            } catch (err) {
              console.error("❌ Failed to invoke Edge Function:", err);
            }
          }
        } else {
          setWorkSpaceNotCreated(true);
          console.error("Error fetching workspace_id:", userError);
        }
        const channels = await getChannelsByWorkspaceId(ws.id);
        if (channels) {
          setFeedsChannels(channels);
        } else {
          console.error("Error fetching channels for workspace:", error);
        }
      }
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching data");
    } 
  };

  useEffect(() => {
    
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // First, check if we have a session from LinkedIn login
        const { data: authData } = await supabase.auth.getSession();
        
        if (authData?.session) {
          // We have a session, check if it's from LinkedIn
          const user = authData.session.user;
          
          if (user) {
            // Get workspace ID from URL if available
            const queryParams = new URLSearchParams(window.location.search);
            const accessCode = queryParams.get('access_code');
            let workspaceId = null;
            
            if (accessCode) {
              // Fetch workspace details using edge function
              try {
                const { data: workspaceData, error } = await supabase.functions.invoke(
                  'get-workspaceInfo-accesscode',
                  {
                    body: { access_code: accessCode }
                  }
                );
                
                if (!error && workspaceData) {
                  workspaceId = workspaceData.id;
                } else {
                  console.error("Error from Edge Function:", error);
                }
              } catch (error) {
                console.error("Error fetching workspace from access code:", error);
              }
            }
            
            // Try LinkedIn auth
            const linkedInAuthResult = await handleLinkedInAuth(workspaceId);
            
            if (linkedInAuthResult.success) {
              return; // Successfully authenticated with LinkedIn
            }
          }
        }
        
        // If LinkedIn auth failed or no session, fall back to regular auth methods
        if (import.meta.env.VITE_ENVIORNMENT === "development") {
          console.log("from development");
          try {
            await getDataAndToken();
          } catch (error) {
            console.error("Development auth failed:", error);
            // No need to set isLoading here, as getDataAndToken already sets it
          }
        } else {
          console.log("from production");
          try {
            await getToken();
          } catch (error) {
            console.error("Production auth failed:", error);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const loginResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/loginSocialHub`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const LoginResponse = await loginResponse.json();
      console.log("from social hub login: ", LoginResponse);

      if (!LoginResponse.success) {
        // Handle non-200 responses
        throw new Error("Login failed");
      }

      if (import.meta.env.VITE_ENVIORNMENT === "development") {
        console.log("from development");
        await getDataAndToken();
      } else {
        console.log("from production");
        await getToken();
      }

      return LoginResponse.success;
    } catch (error) {
      // toast.error("Login failed");
      console.error("SocialHub login error:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        isLoading,
        authUser,
        currentUserUsers,
        currentUserTeams,
        currentUserChannels,
        workSpaceNotCreated,
        setWorkSpaceNotCreated,
        workSpace,
        setWorkSpace,
        feedsChannels,
        setFeedsChannels,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
