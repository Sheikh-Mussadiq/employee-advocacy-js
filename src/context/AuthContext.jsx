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
import {
  getWorkspaceByAccountId,
  getWorkspaceAccessCode,
  getWorkspaceById,
} from "../services/workspaceServices";
import { getChannelsByWorkspaceId } from "../services/newsFeedsChannelServices";
import { getUserByEmail, updateUser } from "../services/userServices";

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
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError || !user) {
        throw new Error("Failed to get authenticated user");
      }

      setAuthUser(user);

      // Extract LinkedIn profile data
      let firstName = user.user_metadata?.full_name?.split(" ")[0] || "";
      let lastName =
        user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "";
      const avatarUrl = user.user_metadata?.avatar_url || "";
      const email = user.email;

      // Insert or update user data
      const { data: updatedUser, error: updateError } = await updateUser({
        email,
        firstName,
        lastName,
        avatarUrl,
        userId: user.id,
      });

      if (updateError) throw updateError;

      // Set the user in context
      setCurrentUser(updatedUser);

      // Fetch workspace data if we have workspaceId
      if (workspaceId) {
        const { error, workspace: ws } = await getWorkspaceByAccountId(
          workspaceId
        );
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

  // const processLinkedInToken = async (token) => {
  //   try {
  //     setIsLoading(true);

  //     // Set the session with the token from the URL
  //     const { data, error } = await supabase.auth.setSession({
  //       access_token: token,
  //       refresh_token: null,
  //     });

  //     if (error) throw error;

  //     // Get authenticated user
  //     const {
  //       data: { user },
  //       error: getUserError,
  //     } = await supabase.auth.getUser();

  //     if (getUserError || !user) {
  //       throw new Error("Failed to get authenticated user");
  //     }

  //     setAuthUser(user);

  //     // Extract LinkedIn profile data
  //     let firstName = user.user_metadata?.full_name?.split(" ")[0] || "";
  //     let lastName =
  //       user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "";
  //     const avatarUrl = user.user_metadata?.avatar_url || "";
  //     const email = user.email;

  //     // Get workspace ID from localStorage (set during login)
  //     const workspaceId = localStorage.getItem("workspaceId");

  //     // Insert or update user data
  //     const { data: updatedUser, error: updateError } = await updateUser({
  //       email,
  //       firstName,
  //       lastName,
  //       avatarUrl,
  //       userId: user.id,
  //     });

  //     if (updateError) throw updateError;

  //     setCurrentUser(updatedUser);

  //     // Fetch workspace data if we have workspaceId
  //     if (workspaceId) {
  //       const { error, workspace: ws } = await getWorkspaceById(workspaceId);
  //       if (!ws && error?.code === "PGRST116") {
  //         return;
  //       } else {
  //         setWorkSpace(ws);
  //         const channels = await getChannelsByWorkspaceId(ws.id);
  //         if (channels) {
  //           setFeedsChannels(channels);
  //         }
  //       }
  //     }

  //     setIsAuthenticated(true);
  //     return true;
  //   } catch (error) {
  //     console.error("LinkedIn token processing error:", error);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
        const { accessCode, error: accessCodeError } =
          await getWorkspaceAccessCode(ws.id);
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
              const { data, error } = await supabase.functions.invoke(
                "update-user-workspace",
                {
                  body: {
                    userId: user.id,
                    workspaceId: ws.id,
                  },
                }
              );

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
        const { accessCode, error: accessCodeError } =
          await getWorkspaceAccessCode(ws.id);
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
              const { data, error } = await supabase.functions.invoke(
                "update-user-workspace",
                {
                  body: {
                    userId: user.id,
                    workspaceId: ws.id,
                  },
                }
              );

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
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              const user = session.user;
              setAuthUser(user);
              // Get workspace ID from localStorage (set during login)
              const workspaceId = localStorage.getItem("workspaceId");
              
              if (!workspaceId) {
                console.error("No workspace ID found in localStorage");
                setIsLoading(false);
                return;
              }

              // Check if user exists in the users table and has workspace_id
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
              
              if (userError && userError.code !== "PGRST116") {
                console.error("Error fetching user data:", userError);
                setIsLoading(false);
                return;
              }

              if (!userData || !userData.workspace_id) {
                // User doesn't exist or doesn't have workspace_id, create/update them using Edge Function
                try {
                  // Extract LinkedIn profile data
                  let firstName = user.user_metadata?.full_name?.split(" ")[0] || "";
                  let lastName = user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "";
                  const avatarUrl = user.user_metadata?.avatar_url || "";
                  
                  const { data: newUser, error: createError } =
                    await supabase.functions.invoke("create-user-with-workspace", {
                      body: {
                        userId: user.id,
                        email: user.email,
                        firstName: firstName,
                        lastName: lastName,
                        avatarUrl: avatarUrl,
                        workspaceId: workspaceId,
                      },
                    });

                  if (createError) {
                    console.error("Error creating/updating user:", createError);
                    throw createError;
                  }

                  // Set the current user
                  setCurrentUser({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    avatar_url: avatarUrl,
                    workspace_id: workspaceId,
                    role: 'EMPLOYEE'
                  });

                  // Fetch workspace info
                  const { error, workspace: ws } = await getWorkspaceById(workspaceId);
                  if (!ws && error) {
                    console.error("Error fetching workspace:", error);
                    setIsLoading(false);
                    return;
                  } else {
                    setWorkSpace(ws);
                    const channels = await getChannelsByWorkspaceId(ws.id);
                    if (channels) {
                      setFeedsChannels(channels);
                    }
                  }
                } catch (err) {
                  console.error("Failed to create/update user:", err);
                  setIsLoading(false);
                  return;
                }
              } else {
                // User exists with workspace_id, set the current user
                setCurrentUser(userData);

                // Fetch workspace info
                const { error, workspace: ws } = await getWorkspaceById(userData.workspace_id);
                if (!ws && error?.code === "PGRST116") {
                  console.error("Workspace not found:", error);
                  setIsLoading(false);
                  return;
                } else {
                  setWorkSpace(ws);
                  const channels = await getChannelsByWorkspaceId(ws.id);
                  if (channels) {
                    setFeedsChannels(channels);
                  }
                }
              }
              
              // Set authenticated state
              setIsAuthenticated(true);
              setIsLoading(false);
            } else {
              // No session: environment-based auth fallback
              if (import.meta.env.VITE_ENVIRONMENT === "development") {
                await getDataAndToken();
              } else {
                await getToken();
              }
              setIsLoading(false);
            }
          }
        );

        // Initial session check
        if (session) {
          const user = session.user;
          setAuthUser(user);
          
          // Get workspace ID from localStorage (set during login)
          const workspaceId = localStorage.getItem("workspaceId");
          
          if (!workspaceId) {
            console.error("No workspace ID found in localStorage");
            setIsLoading(false);
            return;
          }

          // Check if user exists in the users table and has workspace_id
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (userError && userError.code !== "PGRST116") {
            console.error("Error fetching user data:", userError);
            setIsLoading(false);
            return;
          }

          if (!userData || !userData.workspace_id) {
            // User doesn't exist or doesn't have workspace_id, create/update them using Edge Function
            try {
              // Extract LinkedIn profile data
              let firstName = user.user_metadata?.full_name?.split(" ")[0] || "";
              let lastName = user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "";
              const avatarUrl = user.user_metadata?.avatar_url || "";
              
              const { data: newUser, error: createError } =
                await supabase.functions.invoke("create-user-with-workspace", {
                  body: {
                    userId: user.id,
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    avatarUrl: avatarUrl,
                    workspaceId: workspaceId,
                  },
                });

              if (createError) {
                console.error("Error creating/updating user:", createError);
                throw createError;
              }

              // Set the current user
              setCurrentUser({
                id: user.id,
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                avatar_url: avatarUrl,
                workspace_id: workspaceId,
                role: 'EMPLOYEE'
              });

              // Fetch workspace info
              const { error, workspace: ws } = await getWorkspaceById(workspaceId);
              if (!ws && error) {
                console.error("Error fetching workspace:", error);
                setIsLoading(false);
                return;
              } else {
                setWorkSpace(ws);
                const channels = await getChannelsByWorkspaceId(ws.id);
                if (channels) {
                  setFeedsChannels(channels);
                }
              }
            } catch (err) {
              console.error("Failed to create/update user:", err);
              setIsLoading(false);
              return;
            }
          } else {
            // User exists with workspace_id, set the current user
            setCurrentUser(userData);

            // Fetch workspace info
            const { error, workspace: ws } = await getWorkspaceById(userData.workspace_id);
            if (!ws && error?.code === "PGRST116") {
              console.error("Workspace not found:", error);
              setIsLoading(false);
              return;
            } else {
              setWorkSpace(ws);
              const channels = await getChannelsByWorkspaceId(ws.id);
              if (channels) {
                setFeedsChannels(channels);
              }
            }
          }
          
          // Set authenticated state
          setIsAuthenticated(true);
        } else {
          // Your existing no-session fallback
          if (import.meta.env.VITE_ENVIRONMENT === "development") {
            await getDataAndToken();
          } else {
            await getToken();
          }
        }

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("Auth initialization error:", err);
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
        setIsAuthenticated,
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
        // processLinkedInToken,
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
