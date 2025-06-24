import { useRef, useState, useCallback, useEffect } from "react";

type WorkerStatus = "idle" | "pending";

type Result<T> = {
  jobId: number;
  status: "success" | "error";
  data?: T;
  reason?: string;
};

type StartOptions<TArgs, TResult> = {
  args: TArgs;
  onSuccess?: (data: TResult) => void;
  onError?: (reason: string) => void;
};

export function useWorker<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const [status, setStatus] = useState<WorkerStatus>("idle");
  const [results, setResults] = useState<Result<TResult>[]>([]);
  const isMounted = useRef(true);
  const jobIdRef = useRef(0);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const start = useCallback(
    async (options: StartOptions<TArgs, TResult>) => {
      setStatus("pending");
      const jobId = ++jobIdRef.current;
      try {
        const data = await fn(...options.args);
        if (isMounted.current) {
          setStatus("idle");
          setResults((prev) => [
            { jobId, status: "success", data },
            ...prev,
          ]);
          options.onSuccess?.(data);
        }
      } catch (e) {
        if (isMounted.current) {
          setStatus("idle");
          setResults((prev) => [
            { jobId, status: "error", reason: e instanceof Error ? e.message : String(e) },
            ...prev,
          ]);
          options.onError?.(e instanceof Error ? e.message : String(e));
        }
      }
      return jobId;
    },
    [fn]
  );

  return { start, status, results };
}
