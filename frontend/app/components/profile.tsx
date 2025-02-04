"use client";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Profile(): JSX.Element {
  interface AccountDetails {
    name: string;
    surname: string;
    phone_number: string;
    email: string;
  }
  const url = "http://localhost:5000";
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: "",
    surname: "",
    phone_number: "",
    email: "",
  });
  useEffect(() => {
    if (sessionStorage.getItem("userId")) {
      const loginData = sessionStorage.getItem("userId");
      if (loginData) {
        setUserId(JSON.parse(loginData));
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get(`${url}/accounts/${userId}`).then((response) => {
        const data = response.data.account;
        if (data) {
          setAccountDetails(data);
          setIsLoading(false);
        }
      });
    }
  }, [userId]);
  if (!isLoading) {
    return (
      <main className="profile-container">
        <h2 className="profile-header">Account Details</h2>
        <div className="details-container">
          <div className="detail-item">
            <div className="detail-label">Name</div>
            <div className="detail-value">{accountDetails.name}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Surname</div>
            <div className="detail-value">{accountDetails.surname}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Email</div>
            <div className="detail-value">{accountDetails.email}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Phone Number</div>
            <div className="detail-value">{accountDetails.phone_number}</div>
          </div>
        </div>
        <button className="back-btn" onClick={() => router.push("/home")}>
          Go back
        </button>
      </main>
    );
  } else {
    return <div className="loading-text">Loading...</div>;
  }
}
