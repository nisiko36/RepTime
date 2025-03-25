import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";

// ページ
import HomePage from "../pages/HomePage";
import ReservationsPage from "../pages/ReservationsPage";
import ReservationsPage2 from "../pages/ReservationsPage2";
import ShiftsPage from "../pages/ShiftsPage";
import UsersPage from "../pages/UsersPage";
import CustomerMemosPage from "../pages/CustomerMemosPage";
import OwnerMessagesPage from "../pages/OwnerMessagesPage";
import TimeClockPage from "../pages/TimeClockPage";
import CustomersPage from "../pages/CustomersPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Layout にサイドバーやヘッダーが入る */}
                <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservations2" element={<ReservationsPage2 />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customer-memos/:customerId" element={<CustomerMemosPage />} />
                <Route path="/time-clock" element={<TimeClockPage />} />
                <Route path="/owner-messages" element={
                    <ProtectedRoute><OwnerMessagesPage /></ProtectedRoute>
                } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
