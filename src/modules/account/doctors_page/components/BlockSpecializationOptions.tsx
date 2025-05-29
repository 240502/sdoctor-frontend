import { useFetchAllDepartments } from '../../../../hooks';
import { Select } from 'antd';
import { Major } from '../../../../models/major';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
export const BlockSpecializationOptions = () => {
    const { data, isFetching } = useFetchAllDepartments();
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
                    doctocOptions?.departmentIds?.length === 0
                        ? null
                        : doctocOptions.departmentIds
                }
                onChange={(value: number[]) => {
                    console.log(doctocOptions.departmentIds);
                    if (doctocOptions.departmentIds) {
                        setDoctorOptions({
                            ...doctocOptions,
                            departmentIds: [...doctocOptions.departmentIds, ...value],
                        });
                    }
                    setDoctorOptions({
                        ...doctocOptions,
                        departmentIds: [...value],
                    });
                }}
            >
                {!isFetching &&
                    data?.departments?.map((major: Major) => {
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
