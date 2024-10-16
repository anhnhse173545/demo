import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";
import Register from "./pages/register";
import Login from "./pages/login";
import PaymentPage from "./pages/booking";
import PaymentDetailsPage from "./pages/tripDetail";
import QuotaDetailsPage from "./pages/tripQuota";




function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/contact", element: <CombinedKoiRequestForm/>},
        {path: "/register", element: <Register/>},
        {path: "/login", element: <Login/>},
        {path: "/payment", element: <PaymentPage/>},
        {path: "/payment/:id", element: <PaymentDetailsPage/>},
        {path: "/quota/:id", element: <QuotaDetailsPage/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App