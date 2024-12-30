import { useState } from "react";
import axios from 'axios';
import MainPage from './main_page';
interface AccountDetails {
    username: string,
    password: string,
    name: string,
    surname: string,
    email: string, 
    phone_number: string
}

export default function CreateAccount(): JSX.Element {
    const url = "http://127.0.0.1:5000/create_account"
    const [accountDetails, setAccountDetails] = useState<AccountDetails>({username:'', password:'', name:'', surname:'', email:'', phone_number:''})
    const [isCreated, setIsCreated] = useState<boolean>(false)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (accountDetails.username && accountDetails.password && accountDetails.name && 
            accountDetails.surname && accountDetails.email && accountDetails.phone_number) {
            axios.post(url, accountDetails)
                .then((response) => {
                    console.log(response);
                    setIsCreated(true);
                })
                .catch((error) => {
                    console.error(error);
                    alert("Failed to create account. Please check the details.");
                })
                .finally(() => {
                    setAccountDetails({
                        username: '',
                        password: '',
                        name: '',
                        surname: '',
                        email: '',
                        phone_number: ''
                    });
                });
        }
    };
    if (!isCreated){
    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <input type="text" placeholder="username" value={accountDetails?.username} onChange={(event) => setAccountDetails((previous) => ({
                ...previous,
                username: event.target.value}))}/>

            <input type="password" placeholder="password" value={accountDetails?.password} onChange={(event) => setAccountDetails((previous) => ({
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

            <button type="submit">Create Account</button>
        </form>
        )
    } else {
        alert("Successful account creation")
        return <MainPage/>
    }
}