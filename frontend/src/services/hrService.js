import {
    getAllExitRequests,
    getExitRequest,
    approveExitRequest,
    rejectExitRequest
} from '../api';

const hrService = {
    // Get all exit requests
    getAllExitRequests: async () => {
        try {
            const response = await getAllExitRequests();
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch exit requests';
            throw new Error(errorMessage);
        }
    },

    // Get single exit request
    getExitRequest: async (id) => {
        try {
            const response = await getExitRequest(id);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch exit request';
            throw new Error(errorMessage);
        }
    },

    // Approve exit request
    approveExitRequest: async (id) => {
        try {
            const response = await approveExitRequest(id);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to approve exit request';
            throw new Error(errorMessage);
        }
    },

    // Reject exit request
    rejectExitRequest: async (id, remarks) => {
        try {
            const response = await rejectExitRequest(id, remarks);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to reject exit request';
            throw new Error(errorMessage);
        }
    }
};

export default hrService;