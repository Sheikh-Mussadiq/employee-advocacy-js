// import { createClient } from '@supabase/supabase-js';
// import { SUPABASE_CONFIG } from '../config/supabase';
// // import { useAuth } from '../context/AuthContext';
// import { fetchSocialHubDataAndCallBackend } from "../services/socialhubAuth";
// const getMaloonAccessToken = () => {
//   const cookies = document.cookie
//     .split(';')
//     .map(cookie => cookie.trim().split('='))
//     .reduce((acc, [key, val]) => {
//       acc[key] = val;
//       return acc;
//     }, {});

//   return cookies['accesstoken'];
// };

// // Create a fetch interceptor
// const createProxyFetch = (originalFetch) => {
//   return async (url, options = {}) => {
//     try {
//       const originalUrl = new URL(url);

//       // Only intercept Supabase REST and Auth API calls
//       if (!originalUrl.pathname.includes('/rest/v1/') && !originalUrl.pathname.includes('/auth/v1/')) {
//         return originalFetch(url, options);
//       }

//       // Get the access token from memory
//       const maloonAccessToken = getMaloonAccessToken();

//       // Keep original query parameters
//       const queryParams = originalUrl.search.substring(1);

//       // First attempt with current token
//       const proxyUrl = `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/sb-proxy${originalUrl.pathname}${queryParams ? '?' + queryParams : ''}${queryParams ? '&' : '?'}accesstoken=${maloonAccessToken}`;

//       let response = await originalFetch(proxyUrl, {
//         ...options,
//         credentials: 'include', // Important for cookies
//       });

//       // If we get a 401, try to refresh the token
//       if (response.status === 401) {
//         try {
//           // const { authUser, socialHubUser, currentUserTeams } = useAuth();

//           // const refreshResponse = await originalFetch( // maybe use fetch instead of originalFetch
//           //   `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/auth/refresh?accesstoken=${maloonAccessToken}`,
//           //   {
//           //     method: 'POST',
//           //     credentials: 'include',
//           //     headers: {
//           //       'Content-Type': 'application/json'
//           //     },
//           //     body: JSON.stringify({
//           //       authUserId: authUser?.id,
//           //       userId: socialHubUser?.userId,
//           //       accountId: socialHubUser?.accountId,
//           //       teamIds: currentUserTeams.map(team => team.id)
//           //     })
//           //   }
//           // );

          
//           const refreshResponse = await fetchSocialHubDataAndCallBackend();
//           const token = refreshResponse.userInfo.sbToken;
          
//           // Update the session with new access token only (refresh token remains in HTTP-only cookie)
//           await supabase.auth.setSession({
//             access_token: token,
//             refresh_token: token,
//           });

//           // Retry the original request with new token
          
//           response = await originalFetch(proxyUrl, {
//             ...options,
//             credentials: 'include',
//           });
//         } catch (error) {
//           console.error('Token refresh failed:', error);
//           // Force re-authentication
//           window.location.reload();
//           throw error;
//         }
//       }

//       return response;
//     } catch (error) {
//       console.error('Proxy fetch error:', error);
//       throw error;
//     }
//   };
// };

// // Create a proxied Supabase client
// export const createSupabaseProxy = (supabaseClient) => {

//   // Replace the global fetch in the client's config
//   supabaseClient.rest.headers = {
//     ...supabaseClient.rest.headers,
//     'X-Client-Info': 'supabase-js-proxy'
//   };
//   supabaseClient.auth.headers = {
//     ...supabaseClient.auth.headers,
//     'X-Client-Info': 'supabase-js-proxy'
//   };

//   // Override the fetch method in the client's config
//   supabaseClient.rest.fetch = createProxyFetch(fetch);
//   supabaseClient.auth.fetch = createProxyFetch(fetch);

//   return supabaseClient;
// };

// // Create a proxied Supabase client
// // export const createProxiedSupabaseClient = () => {

// //   return createClient(
// //     SUPABASE_CONFIG.url,
// //     SUPABASE_CONFIG.anonKey,
// //     {
// //     auth: {
// //       persistSession: true,
// //       detectSessionInUrl: true,
// //     },
// //     global: {
// //       fetch: createProxyFetch(SUPABASE_CONFIG.url)
// //     }
// //   })
// // }
// export const createProxiedSupabaseClient = () => {
//   return createClient(
//     SUPABASE_CONFIG.url,
//     SUPABASE_CONFIG.anonKey,
//     {
//       auth: {
//         persistSession: true,
//         detectSessionInUrl: true,
//       },
//       global: {
//         fetch: createProxyFetch(fetch) // Fix: Pass the fetch function instead of URL
//       }
//     }
//   )
// }

// // // Export a singleton instance
// export const supabase = createProxiedSupabaseClient()


//------------------------------------------------

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';
import { fetchSocialHubDataAndCallBackend } from "../services/socialhubAuth";
// import { useAuth } from '../context/AuthContext';

// Utility function to retrieve the maloon access token from cookies.
const getMaloonAccessToken = () => {
  const cookies = document.cookie
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});

  return cookies['accesstoken'];
};

// Create a fetch interceptor that also has access to the Supabase client.
// By accepting supabaseClient as a parameter we avoid referencing a global that may be undefined.
const createProxyFetch = (originalFetch, supabaseClient) => {
  return async (url, options = {}) => {
    try {
      const originalUrl = new URL(url);

      // Only intercept Supabase REST and Auth API calls.
      if (
        !originalUrl.pathname.includes('/rest/v1/') &&
        !originalUrl.pathname.includes('/auth/v1/')
      ) {
        return originalFetch(url, options);
      }

      // Retrieve the maloon access token.
      const maloonAccessToken = getMaloonAccessToken();

      // Preserve original query parameters.
      const queryParams = originalUrl.search.substring(1);

      // Construct the proxy URL using the maloon access token.
      const proxyUrl = `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/sb-proxy${originalUrl.pathname}${
        queryParams ? '?' + queryParams : ''
      }${queryParams ? '&' : '?'}accesstoken=${maloonAccessToken}`;

      // First attempt with the current token.
      let response = await originalFetch(proxyUrl, {
        ...options,
        credentials: 'include', // Needed for cookies.
      });

      // On a 401, attempt to refresh the token.
      if (response.status === 401) {
        try {
          const refreshResponse = await fetchSocialHubDataAndCallBackend();
          const token = refreshResponse.userInfo.sbToken;

            // const { authUser, socialHubUser, currentUserTeams } = useAuth();
            
            // const refreshResponse = await originalFetch( // maybe use fetch instead of originalFetch
            //   `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/auth/refresh?accesstoken=${maloonAccessToken}`,
            //   {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //       'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //       authUserId: authUser?.id,
            //       userId: socialHubUser?.userId,
            //       accountId: socialHubUser?.accountId,
            //       teamIds: currentUserTeams.map(team => team.id)
            //     })
            //   }
            // );
          // const token = refreshResponse.accessToken; // Adjust this based on the response structure.

          
          // Update the session: both the access token and the refresh token are set to the same token.
          await supabaseClient.auth.setSession({
            access_token: token,
            refresh_token: token,
          });

          // Retry the original request with the (possibly updated) token.
          // If the cookie is updated automatically by the backend or supabase, you could
          // call getMaloonAccessToken() again here if needed.
          response = await originalFetch(proxyUrl, {
            ...options,
            credentials: 'include',
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Force re-authentication.
          window.location.reload();
          throw error;
        }
      }

      return response;
    } catch (error) {
      console.error('Proxy fetch error:', error);
      throw error;
    }
  };
};

// Create a proxied Supabase client by replacing its fetch implementations.
export const createSupabaseProxy = (supabaseClient) => {
  supabaseClient.rest.headers = {
    ...supabaseClient.rest.headers,
    'X-Client-Info': 'supabase-js-proxy',
  };
  supabaseClient.auth.headers = {
    ...supabaseClient.auth.headers,
    'X-Client-Info': 'supabase-js-proxy',
  };

  // Pass the supabaseClient instance into createProxyFetch so that
  // it is available during token refresh.
  supabaseClient.rest.fetch = createProxyFetch(fetch, supabaseClient);
  supabaseClient.auth.fetch = createProxyFetch(fetch, supabaseClient);

  return supabaseClient;
};

// Create a proxied Supabase client.
// Note: The global fetch passed here is the native fetch; our proxy functions override fetch for REST and Auth.
// export const createProxiedSupabaseClient = () => {
//   const client = createClient(
//     SUPABASE_CONFIG.url,
//     SUPABASE_CONFIG.anonKey,
//     {
//       auth: {
//         persistSession: true,
//         detectSessionInUrl: true,
//       },
//       global: {
//         fetch: fetch,
//       },
//     }
//   );

//   return createSupabaseProxy(client);
// };

// // Export a singleton instance.
// export const supabase = createProxiedSupabaseClient();
