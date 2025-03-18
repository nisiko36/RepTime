import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { login } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleLogin = (user) => {
        login(user);
        navigate("/"); // Homeへ
    };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">ユーザーを選択してログイン</h1>
        <ul className="mt-4">
            {users.map((user) => (
            <li key={user.id} className="p-2 border-b flex justify-between">
                {user.name} ({user.role})
                <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={() => handleLogin(user)}
                >
                ログイン
                </button>
            </li>
            ))}
        </ul>
        </div>
    );
}

export default LoginPage;
