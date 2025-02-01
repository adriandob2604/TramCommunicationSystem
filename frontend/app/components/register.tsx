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
  const url = "http://localhost:5000";
  const router = useRouter();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (
      accountDetails.name &&
      accountDetails.surname &&
      accountDetails.email &&
      accountDetails.name &&
      accountDetails.password
    ) {
      axios
        .post(`${url}/create_account`, { ...accountDetails })
        .then((response) => {
          console.log(response.status);
          setAccountDetails(originalAccountState);
          alert("Account successfully created");
        })
        .catch((err) => console.error(err));
    } else {
      alert("No field can be blank!");
    }
  }
  return (
    <>
      <form onSubmit={(event) => handleSubmit(event)}>
        <h2>Create Account</h2>
        <input
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
          type="text"
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
          type="text"
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
        <button type="submit">Register</button>
      </form>
      <h3>Already have an account?</h3>
      <button onClick={() => router.push("/login")}>Login</button>
    </>
  );
}
