"use client";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe, updateUser } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [username, setUsername] = useState("");

  useEffect(() => {
    getMe().then((user) => {
      setUsername(user.username ?? "");
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUser({ username, email: user.email });
    router.push("/profile");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="https://ac.goit.global/fullstack/react/default-avatar.jpg"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              type="text"
              className={css.input}
              onChange={handleChange}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={handleBack}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
