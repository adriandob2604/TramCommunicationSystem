"use client"
import { usePathname, useSearchParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
export default function Trams(): JSX.Element {
    const searchParams = useSearchParams()
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    return(
        <main>
        {from}{to}
        </main>
    )

}