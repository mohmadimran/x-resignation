export const validateExitProcess = (data) => {
    const errors = {};

    // Validate LWD
    if (!data.lwd) {
        errors.lwd = 'Last Working Day is required';
    } else {
        const lwdDate = new Date(data.lwd);
        if (isNaN(lwdDate.getTime())) {
            errors.lwd = 'Invalid date format';
        } else if (lwdDate <= new Date()) {
            errors.lwd = 'Last Working Day must be a future date';
        }
    }

    // Validate responses
    if (!data.responses || data.responses.length === 0) {
        errors.responses = 'Please answer all exit questions';
    } else {
        data.responses.forEach((item, index) => {
            if (!item.questionText?.trim()) {
                errors[`response_${index}_question`] = 'Question is required';
            }
            if (!item.response?.trim()) {
                errors[`response_${index}_answer`] = 'Answer is required';
            }
        });
    }

    return errors;
};

export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};