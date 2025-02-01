"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

export default function Home(): JSX.Element {
  const url = "http://localhost:5000";
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [stops, setStops] = useState({});
  const router = useRouter();
  const params = new URLSearchParams();
  useEffect(() => {
    const storedStops = localStorage.getItem("stops");
    if (storedStops) {
      setStops(JSON.parse(storedStops));
    }
  }, []);
  console.log(stops);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (from && to) {
      params.set("from", from);
      params.set("to", to);
      router.push(`tramRoute?${params.toString()}`);
    }
  }
  function handleLogout(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    axios
      .delete(`${url}/logout`, {
        withCredentials: true,
      })
      .then(() => {
        console.log("Successfully logged out!");
        router.push("/login");
      });
  }
  return (
    <main>
      <header>Tram Communication System</header>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div>
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <button type="submit">Find tram</button>
        <button onClick={(event) => handleLogout(event)}>Logout</button>
      </form>
    </main>
  );
}
