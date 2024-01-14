import React from "react";

import Link from "next/link";

import Logout from "../components/Logout.jsx";
import { fetchUser } from "../lib/fetchUser.js";
import styles from "../page.module.css";

export default async function Navbar() {
  const user = await fetchUser();

  return (
    <>
      <div className={styles.navBarContainer}>
        <Link href={"/"}>
          <img
            className={styles.logo}
            src="/Logo.png"
            alt="Logo"
            width="75"
            height="70"
          />
        </Link>
        <Link href={"/"}>
          <img
            className={styles.drop}
            src="/hamburger.png"
            alt="Logo"
            width="55"
            height="40"
          />
        </Link>
        <div className={styles.navBarTitle}>
          <p>Pet Taskmaster</p>
        </div>

        {!user.id ? (
          <div className={styles.userSignInContainer}>
            <Link className={styles.loginBtn} href={"/login"}>
              Login
            </Link>
            <Link className={styles.registerBtn} href={"/register"}>
              Sign Up
            </Link>
          </div>
        ) : (
          <div>
            <div>Welcome {user.username}</div>
            <Logout />
          </div>
        )}
      </div>
    </>
  );
}
