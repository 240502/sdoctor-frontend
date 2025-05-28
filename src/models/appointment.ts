export interface Appointment {
    id: number;
    doctorId: number;
    appointmentDate: Date;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    examinationReason: string;
    timeId: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
    doctorName: string;
    timeValue: string;
    price: number;
    location: string;
    type: string;
    gender: number;
    rejectionReason: string;
    serviceId: number;
    serviceName: string;
    invoiceStatus: string;
    paymentMethod: number;
    isEvaluate: number;
}
export interface AppointmentViewForPatient extends Appointment {
    statusName: string;
}

export interface AppointmentCreate {
    doctorId: number;
    appointmentDate: Date;
    examinationReason: string;
    location: string;
    uuid: string;
    scheduleId: number;
    type: string;
}

export interface AppointmentResponseDto {
    id: number;
    doctorId: number;
    appointmentDate: Date;
    examinationReason: string;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
    location: string;
    isEvaluate: number;
    uuid: string;
    scheduleId: number;
    type: string;
    statusName: string;
    invoiceStatus: string;
    paymentMethod: number;
    doctorName: string;
    startTime: string;
    endTime: string;
    amount: number;
    patientName: string;
    gender: number;
    patientPhone: string;
    patientEmail: string;
    birthday: Date;
    province: string;
    district: string;
    commune: string;
    rejectionReason: string;
    serviceName: string;
    clinicName: string;
    prices?: string;
    doctorImage: string;
    patientAddress: string;
}
