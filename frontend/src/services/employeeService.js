import { 
    submitExitProcess,
    getMyExitRequests
} from '../api';

const employeeService = {
    // Submit exit process (resignation + exit responses combined)
    submitExitProcess: async (data) => {
        try {
            const response = await submitExitProcess(data);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to submit exit process';
            throw new Error(errorMessage);
        }
    },

    // Get my exit requests
    getMyExitRequests: async (status = null) => {
        try {
            const response = await getMyExitRequests();
            // Handle both single object and array responses
            const data = Array.isArray(response.data) ? response.data : 
                        response.data ? [response.data] : [];
            return {
                ...response.data,
                data: data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch exit requests';
            throw new Error(errorMessage);
        }
    }
};

export default employeeService;