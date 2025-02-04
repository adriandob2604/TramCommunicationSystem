"use client";
import React, { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const routeIds = [2, 3, 5, 6, 8, 9, 10, 11, 12];
const now = new Date();
const year = now.getFullYear();
const routeStops = new Set();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
const url = "http://localhost:5000";
const socket = io(url);

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
  const [positions, setPosition] = useState<any[]>([]);
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
        const tramPositions: any[] = [];
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
              if (delay !== 0) {
                delayArray.push({
                  routeId: next.routeId,
                  stopName: stop.stopName,
                  delay: delay,
                  arrivalTime: next.arrivalTime.split("T")[1],
                });
              }
              tramPositions.push({
                routeId: next.routeId,
                stopName: next.stopName,
                delay: delay,
                arrivalTime: next.arrivalTime.split("T")[1],
                lat: next.stopLat,
                lon: next.stopLon,
              });
              return acc;
            }, {});

            return result;
          })
        );

        const filteredRoutes = routes.filter((r) => r !== null);
        setRouteData(filteredRoutes);
        setTripDelays(delayArray);
        setPosition(tramPositions);
      } catch (error) {
        console.error("Error fetching tram data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTramData();
    const interval = setInterval(() => {
      fetchTramData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { isLoading, routeData, tripDelays, positions };
};

function RouteDataTrimming(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const [delayData, setDelayData] = useState<string[]>([]);
  const [positionData, setPositionData] = useState<string>();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState({});
  const { isLoading, routeData, tripDelays, positions } = useFetchTramData();
  useEffect(() => {
    if (isLive) {
      socket.emit("delays", tripDelays);
      socket.on("delays", (message) => {
        setDelayData(message);
      });
    }
    return () => {
      socket.off("positions");
    };
  }, [isLive, tripDelays]);

  useEffect(() => {
    if (isFollowing) {
      socket.emit("positions", currentRoute);
      socket.on("positions", (message) => {
        setPositionData(message);
      });
    }
    return () => {
      socket.off("positions");
    };
  }, [isFollowing, currentRoute, positionData]);

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
        acc[next.routeId] = [];
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
            next.stops
              .slice(fromIndexes[i], toIndexes[i] + 1)
              .reduce((a: any, n: any) => {
                if (!a[n.routeId]) {
                  a[n.routeId] = [];
                }
                a[n.routeId].push({
                  stopId: n.stopId,
                  arrivalTime: n.arrivalTime,
                  stopName: n.stopName,
                  delay: n.delay,
                });
                return a;
              }, {})
          );
      }
      return acc;
    }, []);
  });
  const trimmedData = reducedRoutes.map((route: any) =>
    route.filter((trip: any) => trip.length > 0)
  );
  const finalData = trimmedData.map((routeArray: any) =>
    routeArray.map((trip: any) =>
      trip.filter((routeObject: any) =>
        Object.values(routeObject).some((t: any) =>
          t.some((arrival: any) => compareTimes(arrival.arrivalTime))
        )
      )
    )
  );

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    router.push("/home");
  }

  if (isLoading) return <div>Is loading</div>;

  return (
    <main className="main-container">
      <h1 className="page-title">Dane tras</h1>
      <button className="home-btn" onClick={handleClick}>
        Home
      </button>
      <button
        className="delays-btn"
        onClick={() => setIsLive((previous) => !previous)}
      >
        Delays
      </button>

      <aside className="sidebar">
        {isLive ? (
          <>
            <header className="delay-header">Delays</header>
            <div className="delay-list">
              {delayData?.map((currentDelay: any, index: number) => (
                <p key={`${currentDelay}-${index}`} className="delay-item">
                  {currentDelay}
                </p>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="route-list">
          {isFollowing ? <>Skibidi: {positionData}</> : <></>}
          {finalData.map((routeId: any) =>
            routeId.map((trip: any, index: number) =>
              trip.map((route: any) => (
                <div key={uuidv4()} className="route-card">
                  <h3 className="route-title">{Object.keys(route)[index]}</h3>

                  <div className="stop-list">
                    {route[Object.keys(route)[index]].map(
                      (stop: any, i: number) => (
                        <p
                          key={i}
                          className={`stop-item ${
                            stop.delay ? "stop-item-delayed" : ""
                          }`}
                        >
                          Stop: {stop.stopName}, Arrival Time:{" "}
                          {stop.arrivalTime}
                          {", "}
                          {stop.delay ? ` delay: ${Math.abs(stop.delay)}s` : ""}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </aside>
    </main>
  );
}

export default RouteDataTrimming;
