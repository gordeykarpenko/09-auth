"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import css from "../sign-in/AuthForm.module.css";

export default function SignUp() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      setUser(
        await register({
          email: String(data.get("email")),
          password: String(data.get("password")),
        }),
      );
      router.push("/profile");
    } catch {
      setError("Could not create account");
    }
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={submit}>
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
            Register
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
