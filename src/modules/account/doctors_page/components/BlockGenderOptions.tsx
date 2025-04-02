import { Flex, Radio } from 'antd';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { RadioChangeEvent } from 'antd/lib';
import { useEffect } from 'react';

const BlockGenderOptions = () => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    useEffect(() => {
        console.log('doctorOptions', doctorOptions);
    }, [doctorOptions]);
    return (
        <Flex className="" vertical>
            <h6 className="mb-3">Giới tính</h6>
            <Radio.Group
                onChange={(e: RadioChangeEvent) => {
                    setDoctorOptions({
                        ...doctorOptions,
                        gender: e.target.value,
                    });
                    console.log(e.target.value);
                }}
                value={doctorOptions.gender}
                options={[
                    { value: '1', label: 'Nam' },
                    { value: '2', label: 'Nữ' },
                ]}
            ></Radio.Group>
        </Flex>
    );
};
export default BlockGenderOptions;
