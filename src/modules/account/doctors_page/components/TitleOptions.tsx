import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';

export const TitleOptions = () => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    const mocks = [
        {
            value: 'BS',
            name: 'BS.',
        },
        {
            value: 'BSCKI',
            name: 'BSCKI',
        },
        {
            value: 'BSCKII',
            name: 'BSCKII',
        },
        {
            value: 'GS TS BS',
            name: 'GS TS BS.',
        },
        {
            value: 'GS TS',
            name: 'GS TS',
        },
        {
            value: 'Ths.',
            name: 'Ths.',
        },
        {
            value: 'TS.BS',
            name: 'TS.BS.',
        },
    ];
    return (
        <div className="pb-3">
            <h6 className="mb-3">Học hàm/ Học vị</h6>
            <Select
                className="d-block"
                placeholder="Tất cả"
                optionFilterProp="children"
                allowClear
                showSearch
                mode="multiple"
                value={
                    doctorOptions?.titles?.length === 0
                        ? null
                        : doctorOptions?.titles
                }
                onChange={(value: any) => {
                    console.log('value', value);
                    setDoctorOptions({ ...doctorOptions, titles: value ?? [] });
                }}
            >
                {mocks.map((mock) => {
                    return (
                        <Select.Option
                            key={mock.value}
                            value={mock.value}
                            label={mock.name}
                        >
                            {mock.name}
                        </Select.Option>
                    );
                })}
            </Select>
        </div>
    );
};
