import { useMutation } from '@tanstack/react-query';
import { examinationResultService } from '../../services';
import {
    ExaminationResulsCreateDTO,
    ExaminationResultsUpdateDTO,
} from '../../models/examination_results';

export const useCreateExaminationResult = () => {
    return useMutation({
        mutationKey: ['useCreateExaminationResult'],
        mutationFn: (newResult: ExaminationResulsCreateDTO[]) =>
            examinationResultService.createExaminationResult(newResult),
    });
};

export const useUpdateExaminationResult = () => {
    return useMutation({
        mutationKey: ['useUpdateExaminationResult'],
        mutationFn: (newResult: ExaminationResultsUpdateDTO) =>
            examinationResultService.updateExaminationResult(newResult),
    });
};
