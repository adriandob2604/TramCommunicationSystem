"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

export default function Home(): JSX.Element {
  const url = "http://localhost:5000";
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [stops, setStops] = useState<string[]>([]);
  const [filteredFrom, setFilteredFrom] = useState<string[]>(stops);
  const [filteredTo, setFilteredTo] = useState<string[]>(stops);
  const router = useRouter();
  const params = new URLSearchParams();
  useEffect(() => {
    async function getStops() {
      await axios.get(`${url}/stops`).then((response) => {
        const data = response.data;
        if (data) {
          const stopsArray = Object.values(data) as string[];
          setStops(stopsArray);
          setFilteredFrom(stopsArray);
          setFilteredTo(stopsArray);
        }
      });
    }
    getStops();
  }, []);
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
  function handleFromChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const fromSearch = event.target.value;
    setFrom(fromSearch);
    console.log(fromSearch);
    const filteredStops = stops.filter((stop: string) =>
      stop.startsWith(fromSearch.toLowerCase())
    );
    setFilteredFrom(filteredStops);
  }
  function handleToChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const toSearch = event.target.value;
    setTo(toSearch);
    const filteredStops = stops.filter((stop: string) =>
      stop.startsWith(toSearch.toLowerCase())
    );
    setFilteredTo(filteredStops);
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
            onChange={handleFromChange}
          />
        </div>
        <ul>
          {filteredFrom.map((stop: string) => (
            <li key={stop}>{stop}</li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={handleToChange}
          />
        </div>
        <ul>
          {filteredTo.map((stop: string) => (
            <li key={stop}>{stop}</li>
          ))}
        </ul>
        <button type="submit">Find tram</button>
        <button onClick={(event) => handleLogout(event)}>Logout</button>
      </form>
    </main>
  );
}
