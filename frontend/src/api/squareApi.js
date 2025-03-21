const API_BASE_URL = "http://localhost:3000/square";

export const fetchBookings = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return null;
    }
};

export const fetchBookingsWithMemo = async () => {
    try {
        const response = await fetch("http://localhost:3000/square/bookings_with_memo");
        return await response.json();
    } catch (error) {
        console.error("Error fetching bookings with memo:", error);
        return [];
    }
};

