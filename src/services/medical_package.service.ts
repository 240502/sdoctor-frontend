import apiClient from '../constants/api';
import { MedicalPackageUpdateDTO, MedicalPackageCreateDTO } from '../models';

const medicalPackageService = {
    async createService(payload: MedicalPackageCreateDTO): Promise<any> {
        const res = await apiClient.post('/medical-package/create', payload);
        return res;
    },
    async deleteService(id: number | null): Promise<any> {
        const res = await apiClient.delete('/medical-package/delete/' + id);
        return res;
    },
    async updateService(data: MedicalPackageUpdateDTO): Promise<any> {
        const res = await apiClient.put('/medical-package/update/', data);
        return res;
    },
    async getMedicalPackageById(id: number | null): Promise<any> {
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
