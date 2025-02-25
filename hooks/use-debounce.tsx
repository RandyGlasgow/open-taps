import { useCallback, useEffect, useState } from "react";

export const useDebounce = (func: () => void, delay: number) => {
  useEffect(() => {
    const timeout = setTimeout(func, delay);
    return () => clearTimeout(timeout);
  }, [func, delay]);
};

export const useDebounceCallback = (func: () => void, delay: number) => {
  return useCallback(() => {
    const timeout = setTimeout(func, delay);
    return () => clearTimeout(timeout);
  }, [func, delay]);
};

const knownDebounceIntervals = {
  "1s": 1000,
  "2s": 2000,
  "3s": 3000,
  "5s": 5000,
  "10s": 10000,
  "30s": 30000,
  "1m": 60000,
  "2m": 120000,
  "3m": 180000,
  "4m": 240000,
  "5m": 300000,
  "10m": 600000,
  "15m": 900000,
  "30m": 1800000,
  "1h": 3600000,
  "2h": 7200000,
  "4h": 14400000,
};

export const useDebounceInterval = (
  func: () => void,
  delay: keyof typeof knownDebounceIntervals,
) => {
  useEffect(() => {
    const interval = setInterval(func, knownDebounceIntervals[delay]);
    return () => clearInterval(interval);
  }, [func, delay]);
};

export const useTimeoutToggle = (
  initialState: boolean,
  delay: keyof typeof knownDebounceIntervals,
) => {
  const [state, setState] = useState(initialState);

  const toggleState = useCallback(() => {
    setState((prev) => !prev);
    const timeout = setTimeout(() => {
      setState(initialState);
    }, knownDebounceIntervals[delay]);
    return () => clearTimeout(timeout);
  }, [delay, initialState, setState]);

  return [state, toggleState] as const;
};
