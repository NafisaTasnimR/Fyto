import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/marketplace`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getUserMarketplacePosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/user`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching user marketplace posts:', error);
        throw error;
    }
};
