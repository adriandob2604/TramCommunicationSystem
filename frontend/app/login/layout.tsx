import { JSX } from "react";

export default function LoginPageLayout({
    children,
}: Readonly<{children: React.ReactNode}>): JSX.Element {
    return (
        <main>
            <div>{children}</div>
        </main>
    )
}