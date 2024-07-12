import { createContext, useEffect, useState } from "react"


const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [state, setState] = useState({
        token: "",
        user: {}
    })
    useEffect(() => {
        setState(window.localStorage.getItem("auth"))
    }, [])

    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )


}

export { UserContext, UserProvider };
