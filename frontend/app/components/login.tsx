"use client";
import React, { JSX, useState, createContext } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
export interface LoginInfo {
  username: string;
  password: string;
}
export default function Login(): JSX.Element {
  const router = useRouter();
  const url = "http://localhost:5000";

  const [login, setLogin] = useState<LoginInfo>({ username: "", password: "" });
  function handleLogin(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (login.username && login.password) {
      axios
        .post(`${url}/login`, { ...login }, { withCredentials: true })
        .then((response) => {
          const data = response.data;
          const accountId = data.id;
          sessionStorage.setItem("userId", JSON.stringify(accountId));
          console.log(response.status);
          alert("Successfully logged in!");
          router.push("/home");
        })
        .catch(() => {
          alert("Try again");
          console.log("Bad login info");
        });
    } else {
      alert("No field should be empty");
    }
  }
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>

        <input
          className="form-input"
          type="text"
          placeholder="Enter username"
          value={login.username}
          onChange={(event) =>
            setLogin((previous) => ({
              ...previous,
              username: event.target.value,
            }))
          }
          required
        />

        <input
          className="form-input"
          type="password"
          placeholder="Enter password"
          value={login.password}
          onChange={(event) =>
            setLogin((previous) => ({
              ...previous,
              password: event.target.value,
            }))
          }
          required
        />

        <button className="submit-btn" type="submit">
          Log in
        </button>
      </form>

      <div className="auth-redirect">
        <h3 className="redirect-text">Don't have an account?</h3>
        <button className="login-btn" onClick={() => router.push("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
