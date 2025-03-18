import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useShifts = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const response = await apiClient.get("/shifts");
            setShifts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shifts:", error);
            setLoading(false);
        }
    };

    const createShift = async (shiftData) => {
        try {
            await apiClient.post("/shifts", { shift: shiftData });
            fetchShifts(); // シフト一覧をリフレッシュ
        } catch (error) {
            console.error("Error creating shift:", error);
        }
    };

    const updateShift = async (id, shiftData) => {
        try {
            await apiClient.put(`/shifts/${id}`, { shift: shiftData });
            fetchShifts();
        } catch (error) {
            console.error("Error updating shift:", error);
        }
    };

    const deleteShift = async (id) => {
        try {
            await apiClient.delete(`/shifts/${id}`);
            fetchShifts();
        } catch (error) {
            console.error("Error deleting shift:", error);
        }
    };

    return { shifts, loading, createShift, updateShift, deleteShift };
};

export default useShifts;
