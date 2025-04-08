import { Select } from 'antd';
import { useFetchAllMedicalPackageCategory } from '../../../../hooks';
import { Clinic } from '../../../../models/clinic';
import { useRecoilState } from 'recoil';
import { medicalPackageOptionsState } from '../../../../stores/medical_packageAtom';

const CategoryOptionsComp = () => {
    const { data, isFetching } = useFetchAllMedicalPackageCategory();

    const [medicalPackageOptions, setMedicalPackageOptions] = useRecoilState(
        medicalPackageOptionsState
    );
    return (
        <div className="pb-3">
            <h6 className="mb-3">Loại gói khám</h6>
            <Select
                className="d-block"
                placeholder="Tất cả"
                optionFilterProp="children"
                allowClear
                showSearch
                mode="multiple"
                maxCount={4}
                value={
                    medicalPackageOptions?.categoryIds
                        ? medicalPackageOptions?.categoryIds
                        : null
                }
                onChange={(value: any) => {
                    setMedicalPackageOptions({
                        ...medicalPackageOptions,
                        categoryIds: value ?? null,
                    });
                }}
            >
                {!isFetching &&
                    data?.map((clinic: Clinic) => (
                        <Select.Option
                            key={clinic.id}
                            value={clinic.id}
                            label={clinic.name}
                        >
                            {clinic.name}
                        </Select.Option>
                    ))}
            </Select>
        </div>
    );
};
export default CategoryOptionsComp;
