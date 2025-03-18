import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReservationsPage from "../pages/ReservationsPage";
import ShiftsPage from "../pages/ShiftsPage";
import UsersPage from "../pages/UsersPage";
import CustomerMemosPage from "../pages/CustomerMemosPage";
import OwnerMessagesPage from "../pages/OwnerMessagesPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";


function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* NavBar を含むレイアウト */}
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/customer-memos/:customerId" element={<CustomerMemosPage />} />
                <Route path="/owner-messages" element={<ProtectedRoute><OwnerMessagesPage /></ProtectedRoute>} />
            </Route>
        </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
