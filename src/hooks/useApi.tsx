/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, QueryKey, UseQueryOptions, UseMutationOptions } from "react-query";
import { useNavigate } from 'react-router';
import { BASE_URL } from "src/consts/variables";
interface FetchDataParams {
  url: string;
  method?: string;
  token?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface UseFetchQueryParams {
  queryKey: QueryKey;
  url: string;
  id?: string;
  token?: string;
  config?: {
    queryOptions?: UseQueryOptions<any, Error>;
    [key: string]: any;
  };
}

interface UseFetchMutationParams {
  url: string;
  method: string;
  token?: string;
  config?: {
    mutationOptions?: UseMutationOptions<any, Error>;
    [key: string]: any;
  };
}

interface UsePatchMutationParams {
  url: string;
  token?: string;
  config?:any;
}

interface UseDeleteMutationParams {
  url: string;
  token?: string;
  config?: any;
}

function useUniversalFetch() {
  const navigate = useNavigate()

  const queryClient = useQueryClient();

  const fetchData = async ({
    url,
    method = "GET",
    token,
    body = null,
    headers = {},
  }: FetchDataParams): Promise<any> => {
    const isFormData = body instanceof FormData;
    const fetchHeaders: Record<string, string> = {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (!isFormData) {
      fetchHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers: fetchHeaders,
      body: !isFormData && method !== "GET" && method !== "DELETE" ? JSON.stringify(body) : body,
    });


    const res = await response.json();
    if (res.status_code === 401) {
      const token = JSON.parse(localStorage.getItem("authToken") || '[]')
      const refreshToken = JSON.parse(localStorage.getItem("userData") || '[]')


if (token)   {  
    fetch(`${BASE_URL}/auth/refresh-token`, {
        headers:{
          Authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        method:"POST",
        body: JSON.stringify({token: refreshToken?.token?.refresh_token}),
      }).then((res) => res.json())
      .then((ref) => {
        if (ref?.status_code === 200) {
          localStorage.setItem('authToken', JSON.stringify(ref.data.token.access_token));
          localStorage.setItem('userData', JSON.stringify(ref.data));
        }else{
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          navigate('/login')
        }
      });
      }
    
        
        
      
      
      const error = new Error(res?.message?.message || res?.message);
      (error as any).status = response?.status;
      throw error;
    }

    return res
  };

  const useFetchQuery = ({ queryKey, url, id, token = "", config = {} }: UseFetchQueryParams) => {
    const queryKeyPrefix:any = [queryKey, id];
    const urlWithId = id ? `${url}${id}` : url;

    return useQuery(queryKeyPrefix, () => fetchData({ url: urlWithId, token, ...config }), {
      keepPreviousData: true,
      ...config.queryOptions,
    });
  };

  const useFetchMutation = ({ url, method, token = "", config = {} }: UseFetchMutationParams) =>
    useMutation((data: any) => fetchData({ url, method, token,  body: data, ...config }), {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
      ...config.mutationOptions,
    });

  const usePatchMutation = ({ url, token = "", config = {} }: UsePatchMutationParams) =>
    useMutation(
      ({ id, data }: { id: string|number; data: any }) => fetchData({ url: `${url}/${id}`, method: "PATCH", token, body: data }),
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
        ...config.mutationOptions,
      }
    );

  const useDeleteMutation = ({ url, token = "", config = {} }: UseDeleteMutationParams) =>
    useMutation(
      ({ id }: { id: string }) => fetchData({ url: `${url}/${id}`, method: "DELETE", token }),
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
        ...config.mutationOptions,
      }
    );

  return { useFetchQuery, useFetchMutation, usePatchMutation, useDeleteMutation };
}

export default useUniversalFetch;
