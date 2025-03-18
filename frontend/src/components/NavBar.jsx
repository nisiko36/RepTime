import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
        <div>RepTime</div>
        <div>
            {user ? (
            <>
            <span className="mr-4">{user.name} ({user.role})</span>
            <button className="bg-red-500 px-4 py-2" onClick={handleLogout}>ログアウト</button>
            </>
            ) : (
            <button className="bg-blue-500 px-4 py-2" onClick={() => navigate("/login")}>ログイン</button>
            )}
        </div>
        </nav>
    );
}

export default NavBar;
