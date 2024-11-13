import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";

import PaymentPage from "./pages/booking";
import PaymentDetailsPage from "./pages/tripDetail";
import QuotaDetailsPage from "./pages/tripQuota";
import OnGoingPage from "./pages/onGoing";
import { HomepageComponent } from "./pages/home/homepage";
import KoiPage from "./pages/mykoi";
import KoiDetailPage from "./pages/detailFish";
// import CustomerRequest from "./pages/SaleStaff/CustomerRequest";
import AddKoi from "./pages/ConsultingStaff/AddKoi";
import ConsultingStaffHome from "./pages/ConsultingStaff/ConsultingStaffHome";
import KoiDetails from "./pages/ConsultingStaff/KoiDetails";
import OrderList from "./pages/ConsultingStaff/OrderList"; // Renamed to avoid conflict
import TourDetails from "./pages/ConsultingStaff/TourDetails";
import TourList from "./pages/ConsultingStaff/TourList";

import PaidBooking from "./pages/paidBooking";

import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import StaffManagerView from "./pages/Manager/finals/StaffManagerView";
import BookingManagerComponent from "./pages/Manager/finals/booking-manager";
import { SalesStaffManagementComponent } from "./pages/Manager/finals/SalesStaffAssign";
import { ConsultingStaffAssignmentComponent } from "./pages/Manager/finals/ConsultingStaffAssgn";
import { ExtendedQuoteReviewComponent } from "./pages/Manager/finals/QuoteReview";
import UserDetailPage from "./pages/userDetail";
import { DeliveryStaffDashboard } from "./pages/DeliveryStaff/DeliveryStaffDashboard";
import DeliveryOrderListComponent from "./pages/DeliveryStaff/DeliveryOrderList";
import { DeliveryStaffAssignment } from "./pages/Manager/finals/DeliveryStaffAssign";
import SalesStaffDashboard from "./pages/SaleStaff/SalesStaffDashboard";
import CustomerRequest from "./pages/SaleStaff/pages/CustomerRequest";
// import ViewTripPlanComponent from "./pages/SaleStaff/pages/ViewTripPlanComponent";
import ConsultingStaffDashboard from "./pages/ConsultingStaff/ConsultingStaffDashboard";
import TripPaymentPage from "./pages/paytrip";
import PaymentTripPage from "./pages/paykoi";
import PaymentTripPageFull from "./pages/paykoifinished";
import FarmCrud from "./pages/Manager/finals/FarmCrud";
import VarietyCrud from "./pages/Manager/finals/VarietyCrud";
import { OrderDetailsComponent } from "./pages/DeliveryStaff/OrderDetails";
import { FarmImageUpload } from "./components/farm-image-upload";
import { KoiFarmViewSearchComponent } from "./pages/Manager/finals/KoiFarmViewSearchComponent";
import { KoiTripViewSearchComponent } from "./pages/Manager/finals/KoiTripViewSearchComponent";
import { HomepageGuest } from "./pages/homeguest";
import BookingHistoryPage from "./pages/history";
import AboutUs from "./pages/aboutUs";
// import { CreateTripForm } from "./pages/SaleStaff/pages/CreateTripForm";
import DeliveryStaffHome from "./pages/DeliveryStaff/DeliveryStaffHome.jsx";
// Global and Library Styles
import "./styles/App.css"; // Main or global CSS file
import AllBookingsPage from "./pages/Manager/finals/AllBookingPage";
import RefundKoi from "./pages/refundkoifish";
import { LoginComponent } from "./pages/auth/Login";
import { RegisterComponent } from "./pages/auth/Register";
import RequireAuth from "./pages/auth/RequireAuth";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";
function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginComponent />} />
      <Route path="register" element={<RegisterComponent />} />
      {/* <Route path="/" element={< />} /> */}

      <Route path="/" element={<Layout />}>
        {/* Public routes */}

        <Route path="/" element={<HomepageComponent />} />
        <Route path="guest" element={<HomepageGuest />} />

        <Route path="aboutus" element={<AboutUs />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="farm-view" element={<KoiFarmViewSearchComponent />} />
        <Route path="trip-view" element={<KoiTripViewSearchComponent />} />
      </Route>

      {/* Customer routes */}
      <Route element={<RequireAuth allowedRoles={["Customer"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="contact/:id" element={<CombinedKoiRequestForm />} />
          <Route path="payment/:id" element={<PaymentPage />} />
          <Route path="request/:id" element={<PaymentDetailsPage />} />
          <Route path="quota/:id" element={<QuotaDetailsPage />} />
          <Route path="onGoing/:id" element={<OnGoingPage />} />
          <Route path="mykoi" element={<KoiPage />} />
          <Route path="mykoi/:id" element={<KoiDetailPage />} />
          <Route path="paidbooking/:id" element={<PaidBooking />} />
          <Route path="koifarmpage" element={<KoiFarmViewSearchComponent />} />
          <Route path="koi-trip" element={<KoiTripViewSearchComponent />} />
          <Route path="userDetail/:id" element={<UserDetailPage />} />
          <Route path="paytrip" element={<TripPaymentPage />} />
          <Route path="paykoi50/:id" element={<PaymentTripPage />} />
          <Route path="paykoi100/:id" element={<PaymentTripPageFull />} />
          <Route path="history/:id" element={<BookingHistoryPage />} />
          <Route path="refundkoi/:id" element={<RefundKoi />} />
        </Route>
      </Route>
      {/* Manager routes */}
      <Route element={<RequireAuth allowedRoles={["Manager"]} />}>
        <Route path="manager-dashboard" element={<ManagerDashboard />}>
          <Route path="all-booking" index element={<AllBookingsPage />} />
          <Route path="dashboard" element={<FarmImageUpload />} />
          <Route path="staff-manager" element={<StaffManagerView />} />
          <Route path="booking-manager" element={<BookingManagerComponent />} />
          <Route
            path="sales-staff-assignment"
            element={<SalesStaffManagementComponent />}
          />
          <Route
            path="consulting-staff-assignment"
            element={<ConsultingStaffAssignmentComponent />}
          />
          <Route
            path="delivery-staff-assignment"
            element={<DeliveryStaffAssignment />}
          />
          <Route
            path="quotes-review"
            element={<ExtendedQuoteReviewComponent />}
          />
          <Route path="farm-control" element={<FarmCrud />} />
          <Route path="variety-control" element={<VarietyCrud />} />

          <Route path="farm-view" element={<KoiFarmViewSearchComponent />} />
          <Route path="trip-view" element={<KoiTripViewSearchComponent />} />
        </Route>
      </Route>

      {/* Delivery Staff routes */}
      <Route element={<RequireAuth allowedRoles={["Delivery Staff"]} />}>
        <Route path="ds-dashboard" element={<DeliveryStaffDashboard />}>
          <Route path=":deliveryStaffId" element={<DeliveryStaffHome />} />
          <Route
            path="my-deliveries"
            element={<DeliveryOrderListComponent />}
          />
          <Route
            path="my-deliveries/order-details/:orderId"
            element={<OrderDetailsComponent />}
          />
        </Route>
      </Route>

      {/* Sales Staff routes */}
      <Route element={<RequireAuth allowedRoles={["Sales Staff"]} />}>
        <Route path="ss-dashboard" element={<SalesStaffDashboard />}>
          <Route path="customer-request" element={<CustomerRequest />} />
        </Route>
      </Route>

      {/* Consulting Staff routes */}
      <Route element={<RequireAuth allowedRoles={["Consulting Staff"]} />}>
        <Route path="cs-dashboard" element={<ConsultingStaffDashboard />}>
          <Route path=":consultingStaffId" element={<ConsultingStaffHome />} />
          <Route path="tour-list/:consultingStaffId" element={<TourList />} />
          <Route
            path="tour-list/:consultingStaffId/tour-details/:bookingId"
            element={<TourDetails />}
          />
          <Route path="order-list/:consultingStaffId" element={<OrderList />} />
          <Route
            path="order-list/:consultingStaffId/add-koi"
            element={<AddKoi />}
          />
          <Route path="koi-details" element={<KoiDetails />} />
        </Route>
      </Route>

      {/* Catch all */}
      {/* <Route path="*" element={<Missing />} /> */}
    </Routes>
  );
}

export default App;
