import type { UseFetchOptions } from 'nuxt/app';
import { defu } from 'defu';

export interface IPagination {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: null | number;
  next: null | number;
}

export interface IResponse<T> {
  data: T;
  pagination?: IPagination;
}

/**
 * A function that uses custom fetch to make API requests.
 *
 * @param {string} url - The URL to make the API request to.
 * @param {UseFetchOptions<IResponse<T>>} options - The options object for the fetch request.
 */
export function useCustomFetch<T>(
  url: string,
  options: UseFetchOptions<IResponse<T>> = {},
) {
  const config = useRuntimeConfig();

  const defaults: UseFetchOptions<IResponse<T>> = {
    baseURL: config.public.apiBase,
    credentials: 'include',
    mode: 'cors',
    server: false,
  };

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults);

  return useFetch(url, params);
}
