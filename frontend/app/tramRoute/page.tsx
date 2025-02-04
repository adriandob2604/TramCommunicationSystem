import { JSX } from "react";
import RouteDataTrimming from "../components/trams";
import TramRoutePageLayout from "./layout";
import { Suspense } from "react";
export default function TramRoutePage(): JSX.Element {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <TramRoutePageLayout>
        <RouteDataTrimming />
      </TramRoutePageLayout>
    </Suspense>
  );
}
