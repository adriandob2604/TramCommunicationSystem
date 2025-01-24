import { JSX } from "react"
import Register from "../components/register"
import RegisterPageLayout from "./layout"
export default function RegisterPage(): JSX.Element {

    return(
        <RegisterPageLayout>
         <Register />
     </RegisterPageLayout>
)}