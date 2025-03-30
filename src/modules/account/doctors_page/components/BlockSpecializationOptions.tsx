import { useFetchSpecializationsWithPagination } from '../../../../hooks';
import { Select } from 'antd';
import { Major } from '../../../../models/major';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
export const BlockSpecializationOptions = () => {
    const { data, isFetching } = useFetchSpecializationsWithPagination({});
    const [doctocOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    return (
        <div className="pb-3">
            <h6 className="mb-3">Chuyên khoa</h6>
            <Select
                className="d-block"
                placeholder="Tất cả"
                optionFilterProp="children"
                allowClear
                mode="multiple"
                showSearch
                value={
                    doctocOptions?.majorIds?.length === 0
                        ? null
                        : doctocOptions.majorIds
                }
                onChange={(value: number[]) => {
                    console.log(doctocOptions.majorIds);
                    if (doctocOptions.majorIds) {
                        setDoctorOptions({
                            ...doctocOptions,
                            majorIds: [...doctocOptions.majorIds, ...value],
                        });
                    }
                    setDoctorOptions({
                        ...doctocOptions,
                        majorIds: [...value],
                    });
                }}
            >
                {!isFetching &&
                    data?.majors?.map((major: Major) => {
                        return (
                            <Select.Option value={major.id}>
                                {major.name}
                            </Select.Option>
                        );
                    })}
            </Select>
        </div>
    );
};
