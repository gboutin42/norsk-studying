import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    setCurrentUser: () => { },
    setUserToken: () => { }
});

export const ContextProvider = ({ children }) => {
    const [currentUser, _setCurrentUser] = useState(JSON.parse(localStorage.getItem('USER')) || {})
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '')

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem('TOKEN', token)
        } else {
            localStorage.removeItem('TOKEN')
        }
        _setUserToken(token)
    }

    const setCurrentUser = (user) => {
        if (user) {
            localStorage.setItem('USER', JSON.stringify(user))
        } else {
            localStorage.removeItem('USER')
        }
        _setCurrentUser(user)
    }

    return (
        <StateContext.Provider value={{
            currentUser, setCurrentUser,
            userToken, setUserToken
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const userStateContext = () => useContext(StateContext)