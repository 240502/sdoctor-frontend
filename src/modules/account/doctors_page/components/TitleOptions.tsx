import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { useFetchAllDegrees } from '../../../../hooks';
import { Degrees } from '../../../../models/degrees';

export const TitleOptions = () => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    const { data, error, isFetching } = useFetchAllDegrees();

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
                maxCount={6}
                value={
                    doctorOptions?.doctorTitles?.length === 0
                        ? null
                        : doctorOptions?.doctorTitles
                }
                onChange={(value: any) => {
                    console.log('value', value);
                    setDoctorOptions({
                        ...doctorOptions,
                        doctorTitles: value ?? [],
                    });
                }}
            >
                {!isFetching &&
                    data?.map((degree: Degrees) => {
                        return (
                            <Select.Option
                                key={degree.id}
                                value={degree.id}
                                label={degree.name}
                            >
                                {degree.name}
                            </Select.Option>
                        );
                    })}
            </Select>
        </div>
    );
};
