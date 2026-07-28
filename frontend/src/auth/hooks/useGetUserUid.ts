import { useAuth } from "./useAuth";

export function useGetUserUid() {
  const { user } = useAuth();

  return { uid: user?.uid ?? null };
}
