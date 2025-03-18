import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useCustomer = (customerId) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            if (customerId) {
            fetchCustomer();
        }
    }, [customerId]);

    const fetchCustomer = async () => {
        try {
            const response = await apiClient.get(`/customers/${customerId}`);
            setCustomer(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer:", error);
            setLoading(false);
        }
    };

    return { customer, loading };
};

export default useCustomer;
