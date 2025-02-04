"use client";
import { JSX, Suspense } from "react";
import Profile from "../components/profile";
import ProfilePageLayout from "./layout";
Suspense;
export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Ładowanie parametrów...</div>}>
      <ProfilePageLayout>
        <Profile />
      </ProfilePageLayout>
    </Suspense>
  );
}
