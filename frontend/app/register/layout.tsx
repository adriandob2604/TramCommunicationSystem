import { JSX } from "react";

export default function RegisterPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): JSX.Element {
    return (
        <main>
            <div>{children}</div>
        </main>
    )
}