import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useReservations = (date = null) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!date) {
            // 全一覧
            fetchAllReservations();
        } else {
            // 日付指定
            fetchReservationsByDate(date);
        }
    }, [date]);

    // 全予約を取得してソート
    const fetchAllReservations = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/reservations");
            const data = response.data;

            // ★開始時刻で昇順に並び替え
            data.sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

            setReservations(data);
        } catch (err) {
            console.error("Error fetching all reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    // 日付指定で取得してソート
    const fetchReservationsByDate = async (dateParam) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/reservations/by_date?date=${dateParam}`);
            const data = response.data;

            // ★開始時刻で昇順に並び替え
            data.sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

            setReservations(data);
        } catch (err) {
            console.error("Error fetching reservations by date:", err);
        } finally {
            setLoading(false);
        }
    };

    // create, update, delete は同じ
    const createReservation = async (reservationData) => {
        try {
            await apiClient.post("/reservations", { reservation: reservationData });
            if (date) {
                fetchReservationsByDate(date);
            } else {
                fetchAllReservations();
            }
        } catch (error) {
            console.error("Error creating reservation:", error);
        }
    };

    const updateReservation = async (id, reservationData) => {
        try {
            await apiClient.put(`/reservations/${id}`, { reservation: reservationData });
            if (date) {
                fetchReservationsByDate(date);
            } else {
                fetchAllReservations();
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    const deleteReservation = async (id) => {
        try {
            await apiClient.delete(`/reservations/${id}`);
            if (date) {
                fetchReservationsByDate(date);
            } else {
                fetchAllReservations();
            }
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    return {
        reservations,
        loading,
        createReservation,
        updateReservation,
        deleteReservation,
    };
};

export default useReservations;
