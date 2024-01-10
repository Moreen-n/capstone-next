"use client";
import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const info = await response.json();

    if (info.error) {
      return setError(info.error);
    }
    router.push("/");
    router.refresh();
  }

  function createPet() {}

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleLogin} className={styles.form}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Enter your username"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter your password"
        />

        <button className="login-btn" type="submit">
          Login
        </button>
        <p>No account yet?</p>
        <Link href={"/register"}>Sign Up</Link>
        <p className="error-message">{error}</p>
      </form>
    </div>
  );
}
