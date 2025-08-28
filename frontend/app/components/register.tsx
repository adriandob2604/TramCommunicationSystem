"use client";
import React, { JSX, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Register(): JSX.Element {
  interface AccountDetails {
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
  }
  const originalAccountState = {
    username: "",
    password: "",
    name: "",
    surname: "",
    email: "",
    phone_number: "",
  };
  const [accountDetails, setAccountDetails] =
    useState<AccountDetails>(originalAccountState);
  const url = "http://127.0.0.1:5000";
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const allFilled = Object.values(accountDetails).every(
      (v) => v.trim() !== ""
    );
    if (!allFilled) {
      alert("No field can be blank!");
      return;
    }

    try {
      await axios.post(
        `${url}/create_account`,
        { ...accountDetails },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAccountDetails(originalAccountState);
      alert("Account successfully created");
      router.push("/login");
    } catch (error: any) {
      console.error(
        "Register failed:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
      alert(
        error?.response?.data?.message ||
          "Registration failed. Check console for details."
      );
    }
  }
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Account</h2>

        <input
          className="form-input"
          type="text"
          value={accountDetails.name}
          placeholder="Enter name"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              name: event.target.value,
            }))
          }
        />

        <input
          className="form-input"
          type="text"
          value={accountDetails.surname}
          placeholder="Enter surname"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              surname: event.target.value,
            }))
          }
        />

        <input
          className="form-input"
          type="email"
          value={accountDetails.email}
          placeholder="Enter email"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              email: event.target.value,
            }))
          }
        />

        <input
          className="form-input"
          type="tel"
          value={accountDetails.phone_number}
          placeholder="Enter phone number"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              phone_number: event.target.value,
            }))
          }
        />

        <input
          className="form-input"
          type="text"
          value={accountDetails.username}
          placeholder="Enter username"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              username: event.target.value,
            }))
          }
        />

        <input
          className="form-input"
          type="password"
          value={accountDetails.password}
          placeholder="Enter password"
          onChange={(event) =>
            setAccountDetails((previous) => ({
              ...previous,
              password: event.target.value,
            }))
          }
        />

        <button className="submit-btn" type="submit">
          Register
        </button>
      </form>

      <div className="auth-redirect">
        <h3 className="redirect-text">Already have an account?</h3>
        <button className="login-btn" onClick={() => router.push("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}
