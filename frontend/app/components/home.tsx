"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { JSX, useState } from "react";

export default function Home(): JSX.Element {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const router = useRouter();
  const params = new URLSearchParams();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (from && to) {
      const tramRoute = {"from": from, "to": to}
      params.set('from', from)
      params.set('to', to)
      router.push(`tramRoute?${params.toString()}`)
    }
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
      </form>
    </main>
  );
}
