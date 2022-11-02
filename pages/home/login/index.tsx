import { useApp } from "@/components/App";
import { useAuth } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import { useCurrentUser } from "@/lib/user/hooks";
import { Image } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

import styles from "./login.module.css";

import type { FormEvent } from "react";

export default function Login() {
  const loginForm = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const { mutate } = useCurrentUser();
  const { loginReferral, setLoginReferral } = useAuth();
  const { setError } = useApp();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginForm.current) {
      return;
    }

    const formData = new FormData(loginForm.current);
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (username?.trim() === "") {
      setError("Please enter a username.");
      return;
    } else if (password?.trim() === "") {
      setError("Please enter a password.");
      return;
    }

    const body = { username, password };

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      const { error } = await res.json();
      setError(error);
      return;
    }

    const { user } = await res.json();

    mutate({ user });

    if (!loginReferral) {
      router.push("/");
      return;
    }

    router.push(loginReferral);
    setLoginReferral("");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center">Xminent Login</h1>
      <div className="md:flex w-full panel p-0 overflow-hidden items-center">
        <div className="hidden md:block md:w-1/2 px-1 mb-6 md:mb-0">
          <Image src="/images/luffy.gif" alt="Login GIF." />
        </div>
        <div className="md:w-1/2 p-4 mb-6 md:mb-0">
          <form ref={loginForm} onSubmit={handleLogin}>
            <label htmlFor="username" className={`${styles.label} mb-3`}>
              Display Name
            </label>
            <input type="text" className={`${styles.input} w-full mt-1`} name="username" />
            <label htmlFor="password" className={`${styles.label} mt-3 mb-3`}>
              Password
            </label>
            <input type="password" className={`${styles.input} w-full mt-1`} name="password" />
            <div className="my-3">
              <button type="submit" className={`${styles.btn} ${styles["btn-blue-transparent"]} rounded-full w-full`}>
                Login
              </button>
            </div>
            <div className="flex justify-center gap-4">
              <NextLink href="/signup">Sign Up</NextLink>
              <NextLink href="/forgot-password">Forgot Password</NextLink>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
