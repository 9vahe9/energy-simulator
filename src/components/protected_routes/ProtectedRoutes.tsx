import { Navigate, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../../constants/RoutePaths";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { ReactNode } from "react";

function ProtectedRoutes({children} : {children: ReactNode}){
    const location = useLocation();

    const user = useSelector((state: RootState) => state.auth.userToken)
    
    
    if(!user) { 
        return ( <Navigate to = {LOGIN_PATH}  
        state = {{from: location}} />
        )
    };

    return <>{children}</>
}


export default ProtectedRoutes;