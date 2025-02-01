"use client";
import React, { JSX, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Login(): JSX.Element {
  const router = useRouter();
  const url = "http://localhost:5000";

  interface LoginInfo {
    username: string;
    password: string;
  }
  const [login, setLogin] = useState<LoginInfo>({ username: "", password: "" });

  function handleLogin(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (login.username && login.password) {
      axios
        .post(`${url}/login`, { ...login }, { withCredentials: true })
        .then((response) => {
          console.log(response.status);
          alert("Successfully logged in!");
          router.push("/home");
        })
        .catch((err) => {
          alert("Try again");
          console.error(err);
        });
    } else {
      alert("No field should be empty");
    }
  }
  return (
    <main>
      <h2>Login</h2>
      <form onSubmit={(event) => handleLogin(event)}>
        <input
          type="text"
          placeholder="Enter username"
          value={login.username}
          onChange={(event) =>
            setLogin((previous) => ({
              ...previous,
              username: event.target.value,
            }))
          }
        />
        <input
          type="password"
          placeholder="Enter password"
          value={login.password}
          onChange={(event) =>
            setLogin((previous) => ({
              ...previous,
              password: event.target.value,
            }))
          }
        />
        <button type="submit">Log in</button>
      </form>
      <h3>Don't have an account?</h3>
      <button onClick={() => router.push("/register")}>Register</button>
    </main>
  );
}
