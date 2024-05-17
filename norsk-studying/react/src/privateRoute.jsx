import { Navigate } from "react-router-dom"
import { userStateContext } from "./contexts/ContextProvider"

export default function PrivateRoute({ children }) {
    const { currentUser } = userStateContext()

    console.log("ici ?")
    console.log(currentUser)
    return currentUser.admin
        ? <>
            {children}
        </>
        : <Navigate to="/home" />
}