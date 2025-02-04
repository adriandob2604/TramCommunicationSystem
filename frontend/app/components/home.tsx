"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

export default function Home(): JSX.Element {
  const url = "http://localhost:5000";
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [stops, setStops] = useState<string[]>([]);
  const [filteredFrom, setFilteredFrom] = useState<string[]>([]);
  const [filteredTo, setFilteredTo] = useState<string[]>([]);
  const router = useRouter();
  const params = new URLSearchParams();
  useEffect(() => {
    async function getStops() {
      await axios.get(`${url}/stops`).then((response) => {
        const data = response.data.stops;
        if (data) {
          setStops(data);
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
    const filteredStops = stops.filter((stop: string) =>
      stop.toLowerCase().startsWith(fromSearch.toLowerCase())
    );
    setTimeout(() => {
      if (fromSearch) {
        setFilteredFrom(filteredStops);
      } else {
        setFilteredFrom([]);
      }
    }, 200);
  }
  function handleToChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const toSearch = event.target.value;
    setTo(toSearch);
    const filteredStops = stops.filter((stop: string) =>
      stop.toLowerCase().startsWith(toSearch.toLowerCase())
    );
    setTimeout(() => {
      if (toSearch) {
        setFilteredTo(filteredStops);
      } else {
        setFilteredTo([]);
      }
    }, 200);
  }
  return (
    <main className="home-container">
      <header className="page-header">Tram Communication System</header>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            className="autocomplete-input"
            type="text"
            placeholder="From"
            value={from}
            onChange={handleFromChange}
          />
          <ul className="suggestions-list">
            {filteredFrom.map((stop: string) => (
              <li
                className="suggestion-item"
                key={stop}
                onClick={() => {
                  setFrom(stop);
                  setFilteredFrom([]);
                }}
              >
                {stop}
              </li>
            ))}
          </ul>
        </div>

        <div className="input-group">
          <input
            className="autocomplete-input"
            type="text"
            placeholder="To"
            value={to}
            onChange={handleToChange}
          />
          <ul className="suggestions-list">
            {filteredTo.map((stop: string) => (
              <li
                className="suggestion-item"
                key={stop}
                onClick={() => {
                  setTo(stop);
                  setFilteredTo([]);
                }}
              >
                {stop}
              </li>
            ))}
          </ul>
        </div>

        <div className="button-group">
          <button className="primary-btn" type="submit">
            Find tram
          </button>
          <button
            className="secondary-btn"
            onClick={() => router.push("/profile")}
          >
            Show Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </main>
  );
}
