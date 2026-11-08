import { Navigate } from "react-router-dom";
import { getRoutePath } from "./get-route-path";

// The FAQ was a placeholder; its questions now live on the Support page.
export const support_routes = [
  {
    path: getRoutePath("faq"),
    element: <Navigate to={getRoutePath("help_center")} replace />,
  },
];
