import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/users`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'exists' : 'missing');
        console.log('API URL:', `${API_URL}/me`);
        const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const searchUsers = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/search?query=${query}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
