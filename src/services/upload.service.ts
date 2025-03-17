import { apiClient } from '../constants/api';

export const UploadService = {
    async uploadImage(formData: any): Promise<any> {
        const res = await apiClient.post('/api/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    },
};
