import { useState } from "react"
import axios from 'axios';
interface AccountDetails {
    username: string,
    password: string,
    name: string,
    surname: string,
    email: string, 
    phone_number: string
}

function CreateAccount(): JSX.Element {
    const url = "http://localhost:8000/create_account"
    const [accountDetails, setAccountDetails] = useState<AccountDetails>({username:'', password:'', name:'', surname:'', email:'', phone_number:''})
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): JSX.Element => {
        event.preventDefault();
        if (accountDetails) {
            axios.post(url, accountDetails).then((response) => console.log(response)).catch((error) => console.error(error))
            return <p>Account created!</p>
        }
        return <p>Wrong account information</p>
    }
    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <input type="text" placeholder="username" value={accountDetails?.username} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                username: event.target.value}))}/>

            <input type="text" placeholder="password" value={accountDetails?.password} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                password: event.target.value}))}/>
            <input type="text" placeholder="name" value={accountDetails?.name} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                name: event.target.value}))}/>
            <input type="text" placeholder="surname" value={accountDetails?.surname} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                surname: event.target.value}))}/>
            <input type="text" placeholder="email" value={accountDetails?.email} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                email: event.target.value}))}/>
            <input type="text" placeholder="phone_number" value={accountDetails?.phone_number} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                phone_number: event.target.value}))}/>

            <button>Create Account</button>
        </form>
        
    )
}