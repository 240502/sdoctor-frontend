import { Select } from 'antd';
import { useFetchClinicsWithPagination } from '../../../../hooks';
import { Clinic } from '../../../../models/clinic';
import { useRecoilState } from 'recoil';
import { medicalPackageOptionsState } from '../../../../stores/medical_packageAtom';
import { useMemo } from 'react';

const BlockClinicOptions = () => {
    const { data, isFetching } = useFetchClinicsWithPagination({});
    const [medicalPackageOptions, setMedicalPackageOptions] = useRecoilState(
        medicalPackageOptionsState
    );
    const clinics = useMemo(() => {
        return data?.pages?.flatMap((page) => page.data) ?? [];
    }, [data]);
    return (
        <div className="pb-3">
            <h6 className="mb-3">Cơ sở y tế</h6>
            <Select
                className="d-block"
                placeholder="Tất cả"
                optionFilterProp="children"
                allowClear
                showSearch
                value={
                    medicalPackageOptions.clinicId === 0
                        ? null
                        : medicalPackageOptions.clinicId
                }
                onChange={(value: any) => {
                    setMedicalPackageOptions({
                        ...medicalPackageOptions,
                        clinicId: value ?? null,
                    });
                }}
            >
                {!isFetching &&
                    clinics?.map((clinic: Clinic) => (
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
export default BlockClinicOptions;
