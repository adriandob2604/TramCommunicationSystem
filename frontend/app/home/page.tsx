import { JSX } from "react"
import Home from "../components/home"
import HomePageLayout from "./layout"
export default function HomePage(): JSX.Element {
    return <HomePageLayout>
        <Home/>
    </HomePageLayout>
}