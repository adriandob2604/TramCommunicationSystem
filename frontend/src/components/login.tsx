import axios from "axios"
import { FormEvent, useState } from "react"
import HomePage from "./HomePage"
interface LoginDetails {
    username: string,
    password: string
}

function LoginPage(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({username: '', password:''})

    const handleLogin = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        if (loginDetails.username && loginDetails.password) {
            axios.post("http://127.0.0.1:5000/login").then((response) => {
            console.log(response.data)
            setIsLoggedIn(true)
        }).catch((error) => {
                console.error(`An error has occurred ${error}`)
            }).finally(() => {
                setLoginDetails({username: '', password: ''})
            })
        }

        
    }
    if (!isLoggedIn) {
    return <form onSubmit={(event) => handleLogin(event)}>
      <input type="text" placeholder="username" value={loginDetails.username} onChange={(event) => setLoginDetails((previous) => ({
        ...previous,
        username: event.target.value
      }))}/>
      <input type="password" placeholder="password" value={loginDetails.password} onChange={(event) => setLoginDetails((previous) => ({
        ...previous,
        password: event.target.value
      }))}/>
      <button type="submit">Sign in</button>
    </form>
    } else {
        return <HomePage/>
    }
  

}