// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "../pages/HomePage";
// import ReservationsPage from "../pages/ReservationsPage";
// import ShiftsPage from "../pages/ShiftsPage";
// import UsersPage from "../pages/UsersPage";
// import CustomerMemosPage from "../pages/CustomerMemosPage";
// import OwnerMessagesPage from "../pages/OwnerMessagesPage";
// import LoginPage from "../pages/LoginPage";
// import ProtectedRoute from "./ProtectedRoute";
// import Layout from "../components/Layout";
// import NavBar from "../components/NavBar";
// import TimeClockPage from "../pages/TimeClockPage";

// function AppRoutes() {
//     return (
//         <BrowserRouter>
//         <Routes>
//             <Route path="/login" element={<LoginPage />} />

//             {/* NavBar を含むレイアウト */}
//             <Route element={<Layout />}>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/reservations" element={<ReservationsPage />} />
//                 <Route path="/shifts" element={<ShiftsPage />} />
//                 <Route path="/users" element={<UsersPage />} />
//                 <Route path="/customer-memos/:customerId" element={<CustomerMemosPage />} />
//                 <Route path="/owner-messages" element={<ProtectedRoute><OwnerMessagesPage /></ProtectedRoute>} />
//                 <Route path="/time-clock" element={<TimeClockPage />} />
//             </Route>
//         </Routes>
//         </BrowserRouter>
//     );
// }

// export default AppRoutes;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";

import EmployeeSelectPage from "../pages/EmployeeSelectPage";
import HomePage from "../pages/HomePage";
import ReservationsPage from "../pages/ReservationsPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import OwnerMessagesPage from "../pages/OwnerMessagesPage";
import ShiftAutoPage from "../pages/ShiftAutoPage";
import TimeClockPage from "../pages/TimeClockPage";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/select-employee" element={<EmployeeSelectPage />} />

                {/* サイドバー付き共通レイアウト */}
                <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/customer/:customerId" element={<CustomerDetailPage />} />
                <Route path="/owner-messages" element={<ProtectedRoute><OwnerMessagesPage /></ProtectedRoute>} />
                <Route path="/shift-auto" element={<ProtectedRoute><ShiftAutoPage /></ProtectedRoute>} />
                <Route path="/time-clock" element={<TimeClockPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;

