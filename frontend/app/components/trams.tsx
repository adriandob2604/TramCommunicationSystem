"use client";
import React, { JSX, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const routeIds = [2, 3, 5, 6, 8, 9, 10, 11, 12];
const now = new Date();
const year = now.getFullYear();
const routeStops = new Set();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
function compareTimes(arrivalTime: string): boolean {
  const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  const currentSeconds = timeToSeconds(
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  );
  const providedSeconds = timeToSeconds(arrivalTime);
  return currentSeconds <= providedSeconds;
}
const useFetchTramData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [routeData, setRouteData] = useState<any[]>([]);
  const [tripDelays, setTripDelays] = useState<any[]>([]);

  const url =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/a023ceb0-8085-45f6-8261-02e6fcba7971/download/stoptimes.json";
  const stopsUrl =
    "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json";

  const delayUrl = "https://ckan2.multimediagdansk.pl/delays";
  useEffect(() => {
    const fetchTramData = async () => {
      try {
        const [stoptimesResponse, stopsResponse, delayResponse] =
          await Promise.all([
            axios.get(url),
            axios.get(stopsUrl),
            axios.get(delayUrl),
          ]);

        const delayArray: any[] = [];
        const stopsData = stopsResponse.data[formattedDate]?.stops || [];

        const routes = await Promise.all(
          routeIds.map(async (id) => {
            const routeUrl = stoptimesResponse.data[id]?.[0];
            if (!routeUrl) return null;

            const { data } = await axios.get(routeUrl);
            const result = data.stopTimes.reduce((acc: any, next: any) => {
              const stop = stopsData.find((s: any) => s.stopId === next.stopId);
              routeStops.add(stop?.stopName);
              const delayData = delayResponse.data[stop.stopId];
              const delayDataFiltered = delayData.delay.find(
                (del: any) =>
                  del.estimatedTime ===
                  next.arrivalTime.split("T")[1]?.slice(0, 5)
              );
              const delay = delayDataFiltered
                ? delayDataFiltered.delayInSeconds
                : 0;

              if (!acc[next.tripId]) {
                acc[next.tripId] = {
                  routeId: next.routeId,
                  stops: [],
                };
              }

              acc[next.tripId].stops.push({
                routeId: next.routeId,
                stopId: next.stopId,
                arrivalTime: next.arrivalTime.split("T")[1],
                stopName: stop?.stopName || "Unknown",
                delay: delay,
              });
              delayArray.push({
                routeId: next.routeId,
                stopName: stop.stopName,
                delay: delay,
              });
              return acc;
            }, {});

            return result;
          })
        );

        const filteredRoutes = routes.filter((r) => r !== null);
        setRouteData(filteredRoutes);
        setTripDelays(delayArray);
      } catch (error) {
        console.error("Error fetching tram data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTramData();
  }, []);

  return { isLoading, routeData, tripDelays, routeStops };
};

function RouteDataTrimming(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { isLoading, routeData, tripDelays, routeStops } = useFetchTramData();
  console.log(routeStops);
  if (routeStops) {
    localStorage.setItem("stops", JSON.stringify(routeStops));
  }
  const validRoutes = routeData.filter(
    (route: any) => route !== null && Object.keys(route).length > 0
  );
  const trimmedRoutes = validRoutes.map((route: any) => {
    return Object.values(route).filter((trip: any) =>
      trip.stops.some(
        (stop: any) =>
          stop.stopName.toLowerCase() === from?.toLowerCase() &&
          trip.stops.some(
            (stop: any) => stop.stopName.toLowerCase() === to?.toLowerCase()
          )
      )
    );
  });
  const cleanedRoutes = trimmedRoutes.filter((route) => route.length > 0);
  const reducedRoutes = cleanedRoutes.map((route) => {
    return route.reduce((acc: any, next: any) => {
      if (!acc[next.routeId]) {
        acc[next.routeId.toString()] = [];
      }
      const fromIndexes = next.stops.reduce((a: any, n: any, index: number) => {
        if (n.stopName.toLowerCase() === from?.toLowerCase()) {
          a.push(index);
        }
        return a;
      }, []);
      const toIndexes = next.stops.reduce((a: any, n: any, index: number) => {
        if (n.stopName.toLowerCase() === to?.toLowerCase()) {
          a.push(index);
        }
        return a;
      }, []);

      for (let i = 0; i < fromIndexes.length; i++) {
        if (fromIndexes[i] < toIndexes[i])
          acc[next.routeId].push(
            next.stops.slice(fromIndexes[i], toIndexes[i] + 1)
          );
      }
      return acc;
    }, []);
  });
  const trimmedData = reducedRoutes.map((route: any) =>
    route.filter((trip: any) => trip.length > 0)
  );
  const finalData = trimmedData.map((route: any) =>
    route.map((trip: any) =>
      trip.filter((t: any) =>
        t.some((arrival: any) => compareTimes(arrival.arrivalTime))
      )
    )
  );
  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    router.push("/home");
  }
  // useEffect(() => {});
  // function handleLive(event: React.MouseEvent<HTMLButtonElement>): void {
  //   event.preventDefault();
  //   useEffect(() => {
  //     useFetchTramData();
  //     const intervalId = setInterval(useFetchTramData, 30000);
  //     return () => clearInterval(intervalId);
  //   }, [useFetchTramData]);
  //   useEffect(() => {
  //     socket.emit("clientMessage", routeData);
  //     socket.emit("delays", tripDelays);
  //   }, [routeData]);

  // }
  useEffect(() => {
    if (!localStorage.getItem("stops")) {
      if (routeStops) {
        localStorage.setItem("stops", JSON.stringify(routeStops));
      }
    }
  });
  const [delayData, setDelayData] = useState<any>([]);
  useEffect(() => {
    function handleDelays(): void {
      socket.on("delays", (delays) => {
        const delayedRoutes = tripDelays.filter(
          (trip: any, index: number) => trip.delay !== delays[index].delay
        );
        const mappedDelays = delayedRoutes.map((trip: any) => {
          if (trip.delay > 0) {
            return (
              <p>
                The tram number {trip.routeId}, which was supposed to arrive at:{" "}
                {trip.arrivalTime} will be delayed by {trip.delay} seconds.
              </p>
            );
          }
          if (trip.delay < 0) {
            return (
              <p>
                The tram number {trip.routeId}, which was supposed to arrive at:{" "}
                {trip.arrivalTime} will arrive earlier by {trip.delay} seconds.
              </p>
            );
          }
        });
        setDelayData(mappedDelays);
      });
    }
    handleDelays();
  }, [delayData]);
  if (isLoading) return <div>Is loading</div>;

  return (
    <main>
      <h1>Dane tras</h1>
      <button onClick={(event) => handleClick(event)}>Home</button>
      {/* <button onClick={(event) => handleLive(event)}>Live</button> */}
      <aside>
        <header>Delays</header>
        <div>{delayData.forEach((element: any) => element)}</div>
      </aside>
    </main>
  );
}

export default RouteDataTrimming;
