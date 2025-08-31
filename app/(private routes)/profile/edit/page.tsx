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
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.email) {
          const data = await getMe();
          setUser(data);
          setUsername(data.username ?? "");
        } else {
          setUsername(user.username ?? "");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [user, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUser = await updateUser({ username });
    setUser(updatedUser);
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
          src={
            user?.avatar ||
            "https://ac.goit.global/fullstack/react/default-avatar.jpg"
          }
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
              value={username}
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
