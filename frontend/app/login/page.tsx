import { JSX } from "react"
import Login from "../components/login"
import LoginPageLayout from "./layout"
export default function LoginPage(): JSX.Element {
    return (

        <LoginPageLayout>
            <Login/>
        </LoginPageLayout>)
}