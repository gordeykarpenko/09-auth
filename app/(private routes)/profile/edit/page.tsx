"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateMe } from "../../../../lib/api/clientApi";
import { useAuthStore } from "../../../../lib/store/authStore";
import css from "../Profile.module.css";

export default function EditProfile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState(user?.username ?? "");
  const [saving, setSaving] = useState(false);
  if (!user) return null;
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      setUser(await updateMe({ username }));
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={submit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <p>Email: {user.email}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={saving}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
