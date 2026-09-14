"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import css from "./AuthForm.module.css";

export default function SignIn() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      setUser(
        await login({
          email: String(data.get("email")),
          password: String(data.get("password")),
        }),
      );
      router.push("/profile");
    } catch {
      setError("Invalid email or password");
    }
  };
  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={submit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
