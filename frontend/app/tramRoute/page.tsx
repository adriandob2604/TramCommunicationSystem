import { JSX } from "react";
import RouteDataTrimming from "../components/trams";
import TramRoutePageLayout from "./layout";
export default function TramRoutePage(): JSX.Element {
  return (
    <TramRoutePageLayout>
      <RouteDataTrimming />
    </TramRoutePageLayout>
  );
}
