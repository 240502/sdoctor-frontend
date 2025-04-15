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
