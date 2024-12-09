import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Flex, InputRef, Form } from 'antd';
import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { searchDoctorOptionsGlobal } from '../../../../stores/doctorAtom';
import { doctorService } from '../../../../services/doctorService';
import { useNavigate } from 'react-router-dom';

export const BlockSearchDoctor = () => {
    const [options, setOptions] = useRecoilState(searchDoctorOptionsGlobal);
    const inputSearchRef = useRef<InputRef>(null);
    const navigate = useNavigate();

    return (
        <div className="search-group">
            <h6 className="text-center fs-5">Tìm kiếm bác sĩ</h6>
            <p className="text-center opacity-50">
                Tìm kiếm bác sĩ của bạn và đặt lịch khám trong 1 lần bấm
            </p>
            <Flex className="group-button w-50 m-auto">
                <Input ref={inputSearchRef} placeholder="Tìm kiếm ..."></Input>
                <Button
                    className="ms-2"
                    type="primary"
                    onClick={() => {
                        const newOptions = {
                            ...options,
                            name: inputSearchRef?.current?.input?.value,
                        };
                        setOptions(newOptions);
                        navigate('/list/doctor');
                    }}
                >
                    <SearchOutlined /> Tìm kiếm
                </Button>
            </Flex>
        </div>
    );
};
