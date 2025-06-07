export interface ExaminationResulsCreateDTO {
    invoiceDetailId: number | null;
    appointmentId: number | null;
    patientId?: string | null;
    doctorId?: number | null;
    serviceId: number | null;
    resultText: string | null;
    resultValue: number | null;
    resultUnit: string | null;
    conclusion: string | null;
    isGeneralConclusion?: number;
}

export interface ExaminationResultsUpdateDTO {
    id: number;
    resultText: string;
    resultValue: number;
    resultUnit: string;
    conclusion: string;
}
