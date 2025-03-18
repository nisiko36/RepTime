import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useOwnerMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOwnerMessages();
    }, []);

    const fetchOwnerMessages = async () => {
        try {
            const response = await apiClient.get("/owner_messages");
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching owner messages:", error);
            setLoading(false);
        }
    };

    const createOwnerMessage = async (messageData) => {
        try {
            await apiClient.post("/owner_messages", { owner_message: messageData });
            fetchOwnerMessages();
        } catch (error) {
            console.error("Error creating owner message:", error);
        }
    };

    const updateOwnerMessage = async (id, messageData) => {
        try {
            await apiClient.put(`/owner_messages/${id}`, { owner_message: messageData });
            fetchOwnerMessages();
        } catch (error) {
            console.error("Error updating owner message:", error);
        }
    };

    const deleteOwnerMessage = async (id) => {
        try {
            await apiClient.delete(`/owner_messages/${id}`);
            fetchOwnerMessages();
        } catch (error) {
            console.error("Error deleting owner message:", error);
        }
    };

    return { messages, loading, createOwnerMessage, updateOwnerMessage, deleteOwnerMessage };
};

export default useOwnerMessages;
