import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { PATH } from "../const";

/**
 * PrivateRoute component
 * 
 * This component is used to protect routes that require authentication.
 * It checks if the user is signed in using Clerk's useAuth hook.
 * 
 * If the user is signed in:
 *   - Renders the child routes using <Outlet />
 * If the user is not signed in:
 *   - Redirects to the home page using <Navigate />
 * 
 * Usage in App.tsx:
 * <Route path={PATH.GAME + PATH.ASTERISK} element={<PrivateRoute />}>
 *   <Route path="..." element={<ProtectedComponent />} />
 * </Route>
 */
export const PrivateRoute = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  
  // If user is signed in, render the protected route
  if (isSignedIn) {
    return <Outlet />;
  }
  
  // If user is not signed in, redirect to home with the current location saved
  return <Navigate to={PATH.HOME} state={{ from: location }} replace />;
};
