"use client";
import { JSX, useEffect, useState } from "react";
import axios from "axios";

interface StopTime {
  routeId: string;
  stopId: string;
  arrivalTime: string;
  stopName?: string;
}

export default function Trams(): JSX.Element {
  const [routeData, setRouteData] = useState<Record<string, StopTime[]>>({});

  const ids = Array.from({ length: 12 }, (_, i) => i + 1);
  const routeIds = ids.slice(1);

  const url =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/a023ceb0-8085-45f6-8261-02e6fcba7971/download/stoptimes.json";

  const stopsUrl =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(url);

        const stopsResponse = await axios.get(stopsUrl);
        const stopsData = await stopsResponse.data;

        const routes = await Promise.all(
          routeIds.map(async (id) => {
            const routeUrl = response.data[id]?.[0];
            if (!routeUrl) {
              console.warn(`Nie znaleziono URL dla trasy ${id}`);
              return null;
            }

            const routeResponse = await axios.get(routeUrl);
            const stopTimes = routeResponse.data?.stopTimes || [];

            const reducedData = stopTimes.reduce((acc: any, next: any) => {
              if (!acc[next.tripId]) {
                acc[next.tripId] = [];
              }

              const stop = stopsData[formattedDate]?.stops.find(
                (stop: any) => stop["stopId"] === next.stopId
              );
              acc[next.tripId].push({
                routeId: next.routeId,
                stopId: next.stopId,
                arrivalTime: next.arrivalTime.split("T")[1],
                date: next.date,
                stopName: stop?.stopName || "Nieznany przystanek",
              });

              return acc;
            }, {});

            return reducedData;
          })
        );

        const finalData = routes.filter(Boolean).reduce((acc, route) => {
          return { ...acc, ...route };
        }, {});

        setRouteData(finalData);
        console.log("data acquired:", finalData);
      } catch (error) {
        console.error("Error while fetching", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main>
      <h1>Dane tras</h1>
    </main>
  );
}
