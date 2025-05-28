import { useQuery } from "@tanstack/react-query"
import { appointmentService } from "../../services";

const useFetchTotalAppointmentByStatus = (doctorId: number) => {
    return useQuery({
        queryKey: ["useFetchTotalAppointmentByStatus", doctorId],
        queryFn: () => appointmentService.getTotalAppointmentByStatus(doctorId),
        retry: false
    })
}

export {useFetchTotalAppointmentByStatus}