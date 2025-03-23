import { apiClient } from '../constants/api';

const uploadService = {
    async uploadImage(formData: any): Promise<any> {
        const res = await apiClient.post('/api/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    },
};
export default uploadService;
