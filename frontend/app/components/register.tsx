'use client'
import React, { JSX, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export default function Register(): JSX.Element {
    interface AccountDetails {
        id: string,
        username: string,
        password: string
    }
    const [accountDetails, setAccountDetails] = useState<AccountDetails>({ id: uuidv4(), username: '', password: '' })
    const url = "localhost:5000"
    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        axios.get(`${url}/accounts/${accountDetails.id}`).then((response) => {

        })
    }
    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <h2>Create Account</h2>
            <input type="text" placeholder="Enter username" />
            <input type="password" placeholder="Enter password" />
            <button type="submit">Register</button>
        </form>
    )
}