const API_BASE_URL = "http://localhost:3000/freee";

export const fetchEmployees = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching employees:", error);
        return null;
    }
};

export const postTimeClock = async (employeeId, clockType, datetime) => {
    try {
        const response = await fetch(`${API_BASE_URL}/time_clock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id: employeeId, clock_type: clockType, datetime })
        });
        return await response.json();
    } catch (error) {
        console.error("Error posting time clock:", error);
        return null;
    }
};
