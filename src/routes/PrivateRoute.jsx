import { useContext } from "react"
import { AuthContext } from "../features/auth/context/AuthContext"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children})=>{
    const{token} = useContext(AuthContext)
    return token ? children : <Navigate to="/login" replace></Navigate>
}
export default PrivateRoute;