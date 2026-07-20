import { useState, useCallback } from 'react';
import employeeService from '../services/employeeService';

export const useEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exitRequests, setExitRequests] = useState([]);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Submit exit process
    const submitExitProcess = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        setSubmissionSuccess(false);
        
        try {
            const response = await employeeService.submitExitProcess(data);
            setCurrentRequest(response.data);
            setSubmissionSuccess(true);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to submit exit process');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get my exit requests
    const getMyExitRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await employeeService.getMyExitRequests();
            
            //  Extract data from response
            // The response structure is: { success: true, data: { ... } }
            const requestData = response.data || response;
            
            // Store the raw data, the component will handle the format
            setExitRequests(requestData);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to fetch exit requests');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear data
    const clearData = useCallback(() => {
        setCurrentRequest(null);
        setSubmissionSuccess(false);
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Clear success
    const clearSuccess = useCallback(() => {
        setSubmissionSuccess(false);
    }, []);

    return {
        loading,
        error,
        exitRequests,
        currentRequest,
        submissionSuccess,
        submitExitProcess,
        getMyExitRequests,
        clearData,
        clearError,
        clearSuccess
    };
};

export default useEmployee;