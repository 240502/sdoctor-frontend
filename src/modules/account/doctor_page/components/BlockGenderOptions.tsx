import { Checkbox, Flex, Radio } from 'antd';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { RadioChangeEvent } from 'antd/lib';

const BlockGenderOptions = () => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    return (
        <Flex className="" vertical>
            <h6 className="mb-3">Giới tính</h6>
            <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                    setDoctorOptions({
                        ...doctorOptions,
                        gender: e.target.value,
                    })
                }
                value={doctorOptions.gender}
                options={[
                    { value: 'Nam', label: 'Nam' },
                    { value: 'Nữ', label: 'Nữ' },
                ]}
            ></Radio.Group>
        </Flex>
    );
};
export default BlockGenderOptions;
