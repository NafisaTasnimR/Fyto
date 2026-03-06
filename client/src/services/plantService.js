import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/plants`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const searchPlants = async (query, page = 1, limit = 30) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { q: query, page, limit },
            ...getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error searching plants:', error);
        throw error;
    }
};

export const identifyPlant = async (imageFile, location) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (location) {
            formData.append('location', location);
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/identify`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error identifying plant:', error);
        throw error;
    }
};

export const getPlantDetails = async (plantId) => {
    try {
        const response = await axios.get(`${API_URL}/${plantId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching plant details:', error);
        throw error;
    }
};
