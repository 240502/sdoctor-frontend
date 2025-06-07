import apiClient from '../constants/api';
import {
    ExaminationResulsCreateDTO,
    ExaminationResultsUpdateDTO,
} from '../models/examination_results';

const examinationResultService = {
    async createExaminationResult(
        newResult: ExaminationResulsCreateDTO[]
    ): Promise<any> {
        const res = await apiClient.post('/results/create-result', newResult);
        return res;
    },
    async updateExaminationResult(
        newResult: ExaminationResultsUpdateDTO
    ): Promise<any> {
        const res = await apiClient.put('/update-result', newResult);
        return res;
    },
};

export default examinationResultService;
