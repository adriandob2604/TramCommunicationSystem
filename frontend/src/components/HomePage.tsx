import { useState } from "react"

interface TramRoute {
    startpoint: string,
    endpoint: string
}
export default function HomePage(): JSX.Element {
    const [tramRoute, setTramRoute] = useState<TramRoute>({startpoint:'', endpoint:''})
    return (
        <>
            <header>Tram Communication System</header>
            <nav>
                
                <input type="text" placeholder="Find tram"/>
            </nav>
            <section>
                <div>Active tram routes</div>

            </section>
        </>
    ) 

}