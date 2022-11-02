import { useApp } from "@/components/App";
import Layout from "@/components/Layout";
import { useCurrentUser } from "@/lib/user";
import { Image } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

import styles from "../login/login.module.css";

import type { FormEvent } from "react";
export default function SignUp() {
  const signUpForm = useRef<HTMLFormElement | null>(null);
  const { setError } = useApp();
  const router = useRouter();
  const { mutate } = useCurrentUser();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!signUpForm.current) {
      return;
    }

    const formData = new FormData(signUpForm.current);
    const username = formData.get("username")?.toString();
    const password1 = formData.get("password1")?.toString();
    const password2 = formData.get("password2")?.toString();

    if (username?.trim() === "") {
      setError("Please enter a username.");
      return;
    } else if (password1?.trim() === "") {
      setError("Please enter a password.");
      return;
    } else if (password1 !== password2) {
      setError("Passwords do not match.");
      return;
    }

    const body = { username, password1, password2 };

    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 400) {
      const { error } = await res.json();
      setError(error);
      return;
    }

    const { user } = await res.json();
    mutate({ user });

    router.push("/");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center">Xminent Sign Up</h1>
      <div className="md:flex w-full panel p-0 overflow-hidden items-center">
        <div className="hidden md:block md:w-1/2 px-1 mb-6 md:mb-0">
          <Image src="/images/luffy2.gif" alt="Signup GIF." />
        </div>
        <div className="md:w-1/2 p-4 mb-6 md:mb-0">
          <form ref={signUpForm} onSubmit={handleSignUp}>
            <label htmlFor="username" className={`${styles.label} mb-3`}>
              Display Name
            </label>
            <input type="text" className={`${styles.input} w-full mt-1`} name="username" />
            <label htmlFor="password1" className={`${styles.label} mt-3 mb-3`}>
              Password
            </label>
            <input type="password" className={`${styles.input} w-full mt-1`} name="password1" />
            <label htmlFor="password2" className={`${styles.label} mt-3 mb-3`}>
              Confirm Password
            </label>
            <input type="password" className={`${styles.input} w-full mt-1`} name="password2" />
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
