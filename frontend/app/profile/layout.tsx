import { JSX } from "react";

export default function ProfilePageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <main>
      <div>{children}</div>
    </main>
  );
}
