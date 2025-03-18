import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/users");
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const createUser = async (userData) => {
        try {
            await apiClient.post("/users", { user: userData });
            fetchUsers(); // ユーザー一覧をリフレッシュ
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const updateUser = async (id, userData) => {
        try {
            await apiClient.put(`/users/${id}`, { user: userData });
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await apiClient.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return { users, loading, createUser, updateUser, deleteUser };
};

export default useUsers;
