import { Select } from 'antd';
import { useFetchClinicsWithPagination } from '../../../../hooks';
import { Clinic } from '../../../../models/clinic';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { useMemo } from 'react';

const BlockClinicOptions = () => {
    const { data, isFetching } = useFetchClinicsWithPagination({});
    const [doctocOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
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
                    doctocOptions.clinicId === 0 ? null : doctocOptions.clinicId
                }
                onChange={(value: any) => {
                    console.log('value', value);
                    setDoctorOptions({
                        ...doctocOptions,
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
