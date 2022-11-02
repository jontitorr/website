import { logger } from "@/lib/logger";
import { Loading } from "@nextui-org/react";
import { useAuth } from "components/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Layout from "./Layout";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { initializing, isAuthenticated, setLoginReferral } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      logger.debug(`AuthGuard: Redirecting to login page, referral: ${router.asPath}`);
      setLoginReferral(router.asPath);
      router.push("/login");
    }
  }, [initializing, isAuthenticated, router, setLoginReferral]);

  if (initializing) {
    return (
      <Layout className="w-screen h-screen flex justify-center items-center">
        <Loading color="warning" size="xl" />
      </Layout>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
