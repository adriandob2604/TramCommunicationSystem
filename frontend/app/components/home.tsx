"use client";
import React, { JSX, useState } from "react";

export default function Home(): JSX.Element {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  function handleCurrentLocation(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
  }
  return (
    <main>
      <header>Tram Communication System</header>
      <nav>
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
        <button>Find tram</button>
      </nav>
    </main>
  );
}
