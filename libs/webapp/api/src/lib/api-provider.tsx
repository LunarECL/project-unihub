import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CircularProgress, Grid } from '@mui/material';

// Home libs only require querying
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
    },
  },
});

export interface ApiProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper 'provider' to init axios interceptor
 */
export function ApiProvider({ children }: ApiProviderProps) {
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let interceptor: number;

    const initializeInterceptor = async () => {
      try {
        interceptor = axios.interceptors.request.use(
          async (config) => {
            if (config) {
              const accessToken = await getAccessTokenSilently({});

              if (accessToken) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${accessToken}`,
                };
              }
            }

            return config;
          },
          (error) => Promise.reject(error)
        );

        setLoading(false);
      } catch (error) {
        // If an error occurs, retry in 1 second
        setTimeout(initializeInterceptor, 1000);
      }
    };

    initializeInterceptor();

    return () => {
      if (interceptor !== null || interceptor !== undefined) {
        axios.interceptors.request.eject(interceptor);
      }
    };
  }, [getAccessTokenSilently]);

  return (
    <QueryClientProvider client={queryClient}>
      {loading ? (
        <Grid>
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        children
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default ApiProvider;
