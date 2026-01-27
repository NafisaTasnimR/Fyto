import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/journals`;


const getAuthToken = () => {
    return localStorage.getItem('token');
};


const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};



export const createJournalWithFirstPage = async (journalData) => {
    const response = await axios.post(`${API_URL}/with-first-page`, journalData, getAuthHeaders());
    return response.data;
};

export const createJournal = async (journalData) => {
    const response = await axios.post(API_URL, journalData, getAuthHeaders());
    return response;
};
export const getJournals = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/api/journals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserJournals = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const getJournalById = async (journalId) => {
    const response = await axios.get(`${API_URL}/${journalId}`, getAuthHeaders());
    return response.data;
};

export const updateJournal = async (journalId, updates) => {
    const response = await axios.put(`${API_URL}/${journalId}`, updates, getAuthHeaders());
    return response.data;
};

export const deleteJournal = async (journalId) => {
    const response = await axios.delete(`${API_URL}/${journalId}`, getAuthHeaders());
    return response.data;
};

export const updateWordCount = async (journalId) => {
    const response = await axios.post(`${API_URL}/${journalId}/word-count`, {}, getAuthHeaders());
    return response.data;
};



export const createPage = async (journalId, pageData) => {
    const response = await axios.post(`${API_URL}/${journalId}/pages`, pageData, getAuthHeaders());
    return response.data;
};

export const getJournalPages = async (journalId) => {
    const response = await axios.get(`${API_URL}/${journalId}/pages`, getAuthHeaders());
    return response.data;
};

export const getPageById = async (pageId) => {
    const response = await axios.get(`${API_URL}/pages/${pageId}`, getAuthHeaders());
    return response.data;
};

export const updatePage = async (pageId, updates) => {
    const response = await axios.put(`${API_URL}/pages/${pageId}`, updates, getAuthHeaders());
    return response.data;
};

export const deletePage = async (pageId) => {
    const response = await axios.delete(`${API_URL}/pages/${pageId}`, getAuthHeaders());
    return response.data;
};

export const reorderPages = async (journalId, pageOrder) => {
    const response = await axios.put(`${API_URL}/${journalId}/pages/reorder`, { pageOrder }, getAuthHeaders());
    return response.data;
};



export const createBlock = async (pageId, blockData) => {
    const response = await axios.post(`${API_URL}/pages/${pageId}/blocks`, blockData, getAuthHeaders());
    return response.data;
};

export const getPageBlocks = async (pageId) => {
    const response = await axios.get(`${API_URL}/pages/${pageId}/blocks`, getAuthHeaders());
    return response.data;
};

export const getBlockById = async (blockId) => {
    const response = await axios.get(`${API_URL}/blocks/${blockId}`, getAuthHeaders());
    return response.data;
};

export const updateBlock = async (blockId, updates) => {
    const response = await axios.put(`${API_URL}/blocks/${blockId}`, updates, getAuthHeaders());
    return response.data;
};

export const updateBlockStyles = async (blockId, styles) => {
    const response = await axios.patch(`${API_URL}/blocks/${blockId}/styles`, styles, getAuthHeaders());
    return response.data;
};

export const updateBlockPosition = async (blockId, position) => {
    const response = await axios.patch(`${API_URL}/blocks/${blockId}/position`, position, getAuthHeaders());
    return response.data;
};

export const deleteBlock = async (blockId) => {
    const response = await axios.delete(`${API_URL}/blocks/${blockId}`, getAuthHeaders());
    return response.data;
};

export const reorderBlocks = async (pageId, blockOrder) => {
    const response = await axios.put(`${API_URL}/pages/${pageId}/blocks/reorder`, { blockOrder }, getAuthHeaders());
    return response.data;
};

export const bulkUpdateBlocks = async (pageId, blocks) => {
    const response = await axios.put(`${API_URL}/pages/${pageId}/blocks/bulk`, { blocks }, getAuthHeaders());
    return response.data;
};
