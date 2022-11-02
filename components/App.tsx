import { logger } from "@/lib/logger";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

import AuthGuard from "./AuthGuard";
import AuthProvider from "./AuthProvider";
import Footer from "./Footer";
import NavBar, { NavBarError } from "./NavBar";

import type { Dispatch, SetStateAction } from "react";

export interface Link {
  label: string;
  href?: string;
  subdomain?: string;
  root?: boolean;
  callback?: () => void;
  component?: () => JSX.Element;
}

interface LinksContextInterface {
  links: Link[];
  loginReferral: string;
  setError: (err: string) => void;
  setLinks: (links: Link[]) => void;
  setLoginReferral: Dispatch<SetStateAction<string>>;
}

const LinksContext = createContext({} as LinksContextInterface);

export function useApp() {
  const app = useContext(LinksContext);

  if (!app) {
    throw new Error("useApp must be used within AppProvider");
  }

  return app;
}

interface AppProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

export default function App({ children, requiresAuth }: AppProps) {
  const [error, setErrorInternal] = useState<NavBarError>({ message: "", toggle: false });
  const [links, setLinksInternal] = useState<Link[]>([]);
  const [loginReferral, setLoginReferral] = useState<string>("");
  const [lastRoute, setLastRoute] = useState<string>("");
  const [mounting, setMounting] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    logger.debug("App mounted");

    console.log(
      "%cIf you're reading this, you're awesome! 😁",
      "background: #222; color: #bada55; font-size: 2rem; font-weight: bold; padding: 1rem; border-radius: 1rem;"
    );
    console.log(
      "%cIf you like this website, check out the source code here: https://github.com/xminent/website",
      "color: #0000ff; font-size: 1.5rem;"
    );
  }, []);

  useEffect(() => {
    logger.debug("App path changed");

    setMounting(true);
    if (lastRoute !== router.asPath) {
      setLastRoute(router.asPath);
      setLinksInternal([]);
    }
  }, [lastRoute, router.asPath]);

  // Will toggle the error state, allowing the NavBar to display the error even if the error message is the same.
  const setError = (err: string) => {
    setErrorInternal({ message: err, toggle: !error.toggle });
  };

  const setLinks = (ls: Link[]) => {
    if (!mounting) {
      return;
    }
    setLinksInternal(ls);
    setMounting(false);
    setLastRoute(router.asPath);
  };

  const setup = () => {
    logger.debug("Setting up app");
    logger.debug({ links });

    return (
      <LinksContext.Provider value={{ links, loginReferral, setError, setLinks, setLoginReferral }}>
        <NavBar error={error} links={links} />
        {children}
        <Footer />
      </LinksContext.Provider>
    );
  };

  return <AuthProvider>{requiresAuth ? <AuthGuard>{setup()}</AuthGuard> : setup()}</AuthProvider>;
}
