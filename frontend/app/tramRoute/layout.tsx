import { JSX } from "react";

export default function TramRoutePageLayout({
    children,
}: Readonly<{children: React.ReactNode}>): JSX.Element {
    return (
        <main>
            <div>{children}</div>
        </main>
    )
}