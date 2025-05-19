import { NoticeType } from 'antd/es/message/interface';
import React, { useEffect } from 'react';

interface InputWorkingHoursTabProps {
    openMessage: (type: NoticeType, content: string) => void;
    isUpdateClinic: boolean;
    refetch: () => void;
}
const InputWorkingHoursTab = ({
    openMessage,
    isUpdateClinic,
    refetch,
}: InputWorkingHoursTabProps) => {
    useEffect(() => {
        console.log('isUpdateClinic', isUpdateClinic);
    }, []);
    return <div>InputWorkingHoursTab</div>;
};

export default InputWorkingHoursTab;
