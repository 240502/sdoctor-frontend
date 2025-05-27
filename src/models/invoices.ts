export interface Invoices {
    id: number;
    appointmentId: number;
    doctorId: number;
    serviceId: number;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    patientName: string;
    timeValue: string;
    appointmentDate: Date;
    doctorName: string;
    paymentDate: Date;
    paymentMethod: number;
    paymentName: string;
    serviceName: string;
    patientPhone: string;
}

export interface InvoicesCreateDto {
    appointmentId: number;
    doctorId: number;
    amount: number;
    paymentMethod: number;
    services: [] | any;
}
