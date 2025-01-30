import { Navigate } from 'react-router-dom';
import { LayoutComponent } from '../components/layout';
const isAuthenticated = () => {
    // Here you should implement your authentication logic
    // For example, checking if a token is stored in localStorage
    return true
    // return localStorage.getItem("authToken") ? true : false;
};


type PrivateRouteProps = {
    children: React.ReactNode;
}



const PrivateRoute = ({ children }:PrivateRouteProps) => {
    return isAuthenticated() ? <LayoutComponent>{children}</LayoutComponent> : <Navigate to="/login" />;
};

export default PrivateRoute;
