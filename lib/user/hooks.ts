import fetcher from "@/lib/fetcher";
import useSWR from "swr";

import type { User } from "@/lib/api/database";

interface UserPayload {
  user: User | null;
}

export const useCurrentUser = () => {
  return useSWR<UserPayload>("/api/auth/user", fetcher);
};
