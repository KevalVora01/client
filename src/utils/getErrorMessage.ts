export const getErrorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  if (err instanceof Error) return err.message;
  const e = err as { response?: { data?: { error?: string } } };
  return e?.response?.data?.error ?? fallback;
};