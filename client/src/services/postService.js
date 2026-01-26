import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/posts`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getUserPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/user`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${API_URL}/${postId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await axios.put(`${API_URL}/${postId}`, postData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};
