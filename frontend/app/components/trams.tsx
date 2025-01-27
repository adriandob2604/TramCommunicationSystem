"use client";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface StopTime {
  routeId: string;
  stopId: string;
  arrivalTime: string;
  stopName?: string;
}

export default function Trams(): JSX.Element {
  const [routeData, setRouteData] = useState<Record<string, StopTime[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailsClicked, setDetailsClicked] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const ids = Array.from({ length: 12 }, (_, i) => i + 1);
  const routeIds = ids.slice(1);
  const url =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/a023ceb0-8085-45f6-8261-02e6fcba7971/download/stoptimes.json";
  const stopsUrl =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";
  const now = new Date();
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const currentTime = now.toTimeString().split(" ")[0];
  console.log(currentTime);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  function compareTimes(currentTime: string, arrivalTime: string): boolean {
    const [currentHour, currentMinute, currentSecond] = currentTime
      .split(":")
      .map(Number);
    const [arrivalHour, arrivalMinute, arrivalSecond] = arrivalTime
      .split(":")
      .map(Number);
    const current = new Date(
      0,
      0,
      0,
      currentHour,
      currentMinute,
      currentSecond
    );
    const arrival = new Date(
      0,
      0,
      0,
      arrivalHour,
      arrivalMinute,
      arrivalSecond
    );
    return current <= arrival;
  }

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
              if (next.date === formattedDate) {
                if (!acc[next.tripId]) {
                  acc[next.tripId] = [];
                }
                const stop = stopsData[formattedDate]?.stops.find(
                  (stop: any) => stop["stopId"] === next.stopId
                );
                if (compareTimes(currentTime, next.arrivalTime.split("T")[1])) {
                  acc[next.tripId].push({
                    routeId: next.routeId,
                    stopId: next.stopId,
                    arrivalTime: next.arrivalTime.split("T")[1],
                    date: next.date,
                    stopName: stop?.stopName || "Nieznany przystanek",
                  });
                }
                return acc;
              }
            }, {});

            return reducedData;
          })
        );

        const tripData = routes.filter(Boolean).reduce((acc, route) => {
          const filteredRoute = Object.values(route).filter(
            (tripArray: any) => {
              const stopMap = tripArray.map((trip: any) =>
                trip.stopName.toLowerCase()
              );
              const fromIndex = stopMap.indexOf(from?.toLowerCase());
              const toIndex = stopMap.indexOf(to?.toLowerCase());
              return (
                stopMap.includes(from?.toLowerCase()) &&
                stopMap.includes(to?.toLowerCase()) &&
                fromIndex < toIndex
              );
            }
          );
          return { ...acc, ...filteredRoute };
        }, {});

        const fromIndex = Object.values(tripData).map((trip: any) =>
          Object.values(trip).findIndex(
            (t: any) => t.stopName.toLowerCase() === from?.toLowerCase()
          )
        );
        const toIndex = Object.values(tripData).map((trip: any) =>
          Object.values(trip).findIndex(
            (t: any) => t.stopName.toLowerCase() === to?.toLowerCase()
          )
        );
        const trimmedTripData = Object.values(tripData).map(
          (trip: any, index: number) => {
            return trip.slice(fromIndex[index], toIndex[index] + 1);
          }
        );
        console.log(trimmedTripData);

        setRouteData(trimmedTripData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching", error);
      }
    }
    fetchData();
  }, []);
  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <main>
        <h1>Dane tras</h1>
        <div>
          {Object.values(routeData)
            .flat()
            .map((route: Record<string, any>, index: number) => (
              <div key={index}>
                <h4>Route Line: {route?.routeId}</h4>
                <div>Stop: {route?.stopName}</div>
                <div>Arrival time: {route?.arrivalTime}</div>
                <button>Show details</button>
              </div>
            ))}
        </div>
      </main>
    );
  }
}
