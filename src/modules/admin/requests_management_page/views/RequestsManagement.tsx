
import { useRecoilValue } from "recoil";
import AppointmentTable from "../components/AppointmentTable";
import { userState } from "../../../../stores/userAtom";
import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
const RequestsManagement = () => {
    const user = useRecoilValue(userState);
    const [api, contextHolder] = message.useMessage();
    const openMessage = (type: NoticeType, content: string) => {
        api.open({ type, content });
    }

    return <>
        {contextHolder}
    <AppointmentTable openMessage={openMessage} userId={user.supporterId} />
    </>
}

export default RequestsManagement;