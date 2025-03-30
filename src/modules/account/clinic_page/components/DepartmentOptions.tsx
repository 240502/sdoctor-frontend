import { Select } from 'antd';
import { useFetchAllDepartments } from '../../../../hooks';
import { Department } from '../../../../models';
import { useRecoilState } from 'recoil';
import { clinicFilterOptions } from '../../../../stores/clinicAtom';
const DepartmentOptions = () => {
    const { data, error, isFetching } = useFetchAllDepartments();
    const [clinicOptions, setClinicOptions] =
        useRecoilState(clinicFilterOptions);
    return (
        <div className="mb-3">
            <h6 className="mb-3">Chuyên khoa</h6>
            <Select
                className="w-100"
                placeholder="Chọn chuyên khoa"
                mode="multiple"
                maxCount={4}
                allowClear
                onChange={(value: number[]) => {
                    setClinicOptions({
                        ...clinicOptions,
                        departmentIds: value,
                    });
                }}
            >
                {error ? (
                    <p className="text-center fw-bold">{error.message}</p>
                ) : (
                    !isFetching &&
                    data?.departments.map((department: Department) => (
                        <option value={department.id}>{department.name}</option>
                    ))
                )}
            </Select>
        </div>
    );
};

export default DepartmentOptions;
