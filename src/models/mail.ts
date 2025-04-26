export interface SendBookingSuccessMailPayload {
    patientName: string;
    email: string;
    doctorName: string;
    time: string;
    date: string;
    location: string;
    status: string;
    fee: number;
    serviceName: string;
}

export interface SendConfirmSuccessMailPayload {
    patientName: string;
    email: string;
    doctorName: string;
    time: string;
    date: string;
    location: string;
}

export interface SendRejectionMailPayload {
    email: string;
    doctorName: string;
    patientName: string;
    date: string;
    rejectionReason: string;
    requirementObject: string;
}
