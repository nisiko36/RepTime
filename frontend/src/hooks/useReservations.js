import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await apiClient.get("/reservations");
            setReservations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setLoading(false);
        }
    };

    const createReservation = async (reservationData) => {
        try {
            await apiClient.post("/reservations", { reservation: reservationData });
            fetchReservations();
        } catch (error) {
            console.error("Error creating reservation:", error);
        }
    };

    const updateReservation = async (id, reservationData) => {
        try {
            await apiClient.put(`/reservations/${id}`, { reservation: reservationData });
            fetchReservations();
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    const deleteReservation = async (id) => {
        try {
            await apiClient.delete(`/reservations/${id}`);
            setReservations(reservations.filter(res => res.id !== id));
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    return { reservations, loading, createReservation, updateReservation, deleteReservation };
};

export default useReservations;
