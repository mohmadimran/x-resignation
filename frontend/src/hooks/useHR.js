import { useState, useEffect, useCallback } from 'react';
import hrService from '../services/hrService';

export const useHR = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exitRequests, setExitRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [success, setSuccess] = useState(null);

    // Get all exit requests
    const getAllExitRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await hrService.getAllExitRequests();
            setExitRequests(response.data || []);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to fetch exit requests');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get single exit request
    const getExitRequest = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await hrService.getExitRequest(id);
            setSelectedRequest(response.data);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to fetch exit request');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Approve exit request
    const approveRequest = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const response = await hrService.approveExitRequest(id);
            setSuccess('Exit request approved successfully!');
            // Refresh the list
            await getAllExitRequests();
            return response;
        } catch (err) {
            setError(err.message || 'Failed to approve exit request');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getAllExitRequests]);

    // Reject exit request
    const rejectRequest = useCallback(async (id, remarks) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            if (!remarks || !remarks.trim()) {
                throw new Error('Remarks are required for rejection');
            }
            
            const response = await hrService.rejectExitRequest(id, remarks);
            setSuccess('Exit request rejected successfully!');
            // Refresh the list
            await getAllExitRequests();
            return response;
        } catch (err) {
            setError(err.message || 'Failed to reject exit request');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getAllExitRequests]);

    // Clear states
    const clearError = useCallback(() => setError(null), []);
    const clearSuccess = useCallback(() => setSuccess(null), []);
    const clearSelected = useCallback(() => setSelectedRequest(null), []);

    // Auto-refresh every 30 seconds if there are pending requests
    useEffect(() => {
        const hasPending = exitRequests.some(req => req?.status === 'pending');
        
        if (hasPending) {
            const interval = setInterval(() => {
                getAllExitRequests();
            }, 30000);
            
            return () => clearInterval(interval);
        }
    }, [exitRequests, getAllExitRequests]);

    return {
        loading,
        error,
        success,
        exitRequests,
        selectedRequest,
        getAllExitRequests,
        getExitRequest,
        approveRequest,
        rejectRequest,
        clearError,
        clearSuccess,
        clearSelected
    };
};

export default useHR;