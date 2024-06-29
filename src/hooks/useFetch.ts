// useFetch.ts
"use client";
import { useState, useCallback } from "react";

interface FetchResult<T, F extends (...args: any) => Promise<any>> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fn: (...args: Parameters<F>) => Promise<void>;
}

const useFetch = <T, F extends (...args: any) => Promise<T>>(
  cb: F
): FetchResult<T, F> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = useCallback(
    async (...args: Parameters<F>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cb(...args);
        setData(response);
        setError(null);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { data, loading, error, fn };
};

export default useFetch;
