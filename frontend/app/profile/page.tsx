import { JSX } from "react";
import Profile from "../components/profile";
import ProfilePageLayout from "./layout";
export default function LoginPage(): JSX.Element {
  return (
    <ProfilePageLayout>
      <Profile />
    </ProfilePageLayout>
  );
}
