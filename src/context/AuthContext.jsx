import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSocialHubDataAndCallBackend } from "../services/socialhubAuth";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { getWorkspaceByAccountId, getWorkspaceAccessCode, getWorkspaceById } from "../services/workspaceServices";
import { getChannelsByWorkspaceId } from "../services/newsFeedsChannelServices";
import { getUserByEmail } from "../services/userServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socialHubUser, setSocialHubUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [workSpaceNotCreated, setWorkSpaceNotCreated] = useState(false);
  const [workSpace, setWorkSpace] = useState(null);
  const [feedsChannels, setFeedsChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // 1. Try SocialHub Admin authentication first
        if (import.meta.env.VITE_ENVIORNMENT === "development") {
          const response = await getDataAndToken();
          if(response?.success) {
            setIsLoading(false);
            return;
          } 
        } else {
          const response = await getToken();
          if(response?.success) {
            setIsLoading(false);
            return;
          } 
        }

        // 2. Check for existing session if SocialHub auth failed
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const user = session.user;
          setAuthUser(user);
          console.log("User from session:", user);
          // Check if user exists in users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!userError && userData?.workspace_id) {
            // User exists and has workspace_id
            setCurrentUser(userData);
            const { error, workspace: ws } = await getWorkspaceById(userData.workspace_id);
            
            if (!ws && error?.code === "PGRST116") {
              setIsLoading(false);
              return;
            } else {
              setWorkSpace(ws);
              const channels = await getChannelsByWorkspaceId(ws.id);
              if (channels) {
                setFeedsChannels(channels);
              }
            }
            setIsAuthenticated(true);
          } else {
            // User doesn't exist or no workspace_id
            const workspaceId = localStorage.getItem("workspaceId");
            if (!workspaceId) {
              toast.error("User has not joined any workspace yet.");
              setIsLoading(false);
              return;
            }

            try {
              const { data: newUser, error: createError } = await supabase.functions.invoke(
                "create-user-with-workspace",
                {
                  body: {
                    userId: user.id,
                    email: user.email,
                    firstName: user.user_metadata?.name?.split(" ")[0] || "",
                    lastName: user.user_metadata?.name?.split(" ").slice(1).join(" ") || "",
                    avatarUrl: user.user_metadata?.picture || "",
                    workspaceId: workspaceId,
                  },
                }
              );

              if (createError) throw createError;

              setCurrentUser(newUser);
              const { error, workspace: ws } = await getWorkspaceById(workspaceId);
              if (!ws && error) {
                setIsLoading(false);
                return;
              } else {
                setWorkSpace(ws);
                const channels = await getChannelsByWorkspaceId(ws.id);
                if (channels) {
                  setFeedsChannels(channels);
                }
              }
              localStorage.removeItem("workspaceId");
              setWorkSpaceNotCreated(false);
              setIsAuthenticated(true);
            } catch (err) {
              console.error("Failed to create user:", err);
              localStorage.removeItem("workspaceId");
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
        return;
      }
    };

    initAuth();
  }, []);

  // SocialHub authentication functions
  const getDataAndToken = async () => {
    try {
      const responseData = await fetch(
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
        
      if (!responseData.ok) {
        throw new Error("Failed to fetch data from SocialHub API");
      }
      const apiResponse = await responseData.json();
        
      await supabase.auth.setSession({
        access_token: apiResponse.token,
        refresh_token: apiResponse.token,
      });

      // Set Supabase authenticated user from API response.
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();
      if (getUserError) {
        // console.error("getUser error:", getUserError);
        return;
      }
      setAuthUser(user);

      if (apiResponse.userInfo) {
        setSocialHubUser({
          ...apiResponse.userInfo,
          userName: `${apiResponse.userInfo.firstName.replace(/\s+/g, "")}_${apiResponse.userInfo.lastName.replace(/\s+/g, "")}`,
        });

        console.log("from jwt and all data development: ", apiResponse);
        const { error, workspace: ws } = await getWorkspaceByAccountId(apiResponse.userInfo.accountId);
        if (!ws && error?.code === "PGRST116") {
          setWorkSpaceNotCreated(true);
        } else {
          const { accessCode } = await getWorkspaceAccessCode(ws.id);
          if (accessCode) {
            ws.access_code = accessCode;
          }

          setWorkSpace(ws);

          const { data: user } = await supabase.auth.getUser();
          if (user) {
            setAuthUser(user);
            const { data: dbUser } = await supabase
              .from("users")
              .select()
              .eq("id", user.id)
              .single();

            if (dbUser) {
              if (!dbUser.workspace_id || dbUser.workspace_id !== ws.id) {
                const { data, error } = await supabase.functions.invoke(
                  "update-user-workspace",
                  {
                    body: {
                      userId: user.id,
                      workspaceId: ws.id,
                    },
                  }
                );
                if (!error) {
                  setCurrentUser(data);
                }
              } else {
                setCurrentUser(dbUser);
              }
            }
          }

          const channels = await getChannelsByWorkspaceId(ws.id);
          if (channels) {
            setFeedsChannels(channels);
          }
        }
        setIsAuthenticated(true);
        return {success:true}; 
      }
    } catch (error) {
      // console.error("Error in getDataAndToken:", error);
      // toast.error(error.message || "An error occurred while fetching data");
    }
  };

  const getToken = async () => {
    try {
      const apiResponse = await fetchSocialHubDataAndCallBackend();
      
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

      if (apiResponse.userInfo) {
        setSocialHubUser({
          ...apiResponse.userInfo,
          userName: `${apiResponse.userInfo.firstName.replace(/\s+/g, "")}_${apiResponse.userInfo.lastName.replace(/\s+/g, "")}`,
        });

        const { error, workspace: ws } = await getWorkspaceByAccountId(apiResponse.userInfo.accountId);
        if (!ws && error?.code === "PGRST116") {
          setWorkSpaceNotCreated(true);
        } else {
          const { accessCode } = await getWorkspaceAccessCode(ws.id);
          if (accessCode) {
            ws.access_code = accessCode;
          }

          setWorkSpace(ws);

          
          if (user) {
            setAuthUser(user);
            const { data: dbUser } = await supabase
              .from("users")
              .select()
              .eq("id", user.id)
              .single();

            if (dbUser) {
              if (!dbUser.workspace_id || dbUser.workspace_id !== ws.id) {
                const { data, error } = await supabase.functions.invoke(
                  "update-user-workspace",
                  {
                    body: {
                      userId: user.id,
                      workspaceId: ws.id,
                    },
                  }
                );
                if (!error) {
                  setCurrentUser(data);
                }
              } else {
                setCurrentUser(dbUser);
              }
            }
          }

          const channels = await getChannelsByWorkspaceId(ws.id);
          if (channels) {
            setFeedsChannels(channels);
          }
        }

        setIsAuthenticated(true);
        return {success:true}; 
      }
    } catch (error) {
      // console.error("Error in getToken:", error);
      // toast.error(error.message || "An error occurred while fetching token");
    }
  };

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
        setIsAuthenticated,
        socialHubUser,
        currentUser,
        setCurrentUser,
        authUser,
        setAuthUser,
        isLoading,
        workSpaceNotCreated,
        setWorkSpaceNotCreated,
        workSpace,
        setWorkSpace,
        feedsChannels,
        setFeedsChannels,
        login,
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
