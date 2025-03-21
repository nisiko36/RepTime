import React, { useState, useEffect } from "react";
import { fetchBookings } from "../api/squareApi";

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadBookings = async () => {
            const data = await fetchBookings();
            if (data) {
                setBookings(data);
            }
        };
        loadBookings();
    }, []);

    return (
        <div>
            <h1>予約リスト</h1>
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.id}>
                        {booking.customer_name} - {booking.start_at} ({booking.duration_minutes}分)
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingList;
