import axios from "axios";

export const getErrorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;

    if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details.join(", ");
    }

    return data?.message ?? data?.error ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};