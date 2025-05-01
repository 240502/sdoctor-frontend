import apiClient from '../constants/api';

const medicalPackageService = {
    async createService(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            '/medical-package/create',
            data,
            config
        );
        return res;
    },
    async deleteService(id: number, config: any): Promise<any> {
        const res = await apiClient.delete(
            '/medical-package/delete/' + id,
            config
        );
        return res;
    },
    async updateService(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/medical-package/update/',
            data,
            config
        );
        return res;
    },
    async getMedicalPackageById(id: number): Promise<any> {
        const res = await apiClient.get('/medical-package/get-by-id/' + id);
        return res?.data;
    },
    async viewService(data: any): Promise<any> {
        const res = await apiClient.post('/medical-package/view', data);
        return res?.data;
    },
    async getCommonService(): Promise<any> {
        const res = await apiClient.get(
            '/medical-package/get-common-medical-package'
        );
        return res?.data;
    },
    async updateView(id: any): Promise<any> {
        const res = await apiClient.put('/medical-package/update-views/' + id);
        return res;
    },
    async getMedicalPackageByClinicId(clinicId: any): Promise<any> {
        const res = await apiClient.get(
            '/medical-package/get-medical-package-by-clinicid/' + clinicId
        );
        return res?.data;
    },
};

export default medicalPackageService;
