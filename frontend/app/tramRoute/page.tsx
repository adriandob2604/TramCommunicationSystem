import { JSX } from "react"
import Trams from "../components/trams"
import TramRoutePageLayout from "./layout"
export default function RegisterPage(): JSX.Element {
    return(
    <TramRoutePageLayout>
        <Trams />
    </TramRoutePageLayout>
    )
}