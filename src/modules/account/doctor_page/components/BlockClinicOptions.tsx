import { Select } from 'antd';
import { useFetchClinicsWithPagination } from '../../../../hooks';
import { Clinic } from '../../../../models/clinic';

const BlockClinicOptions = () => {
    const { data, isFetching } = useFetchClinicsWithPagination({});
    return (
        <div className="pb-3">
            <h6 className="mb-3">Cơ sở y tế</h6>
            <Select
                className="d-block"
                placeholder="Tất cả"
                optionFilterProp="children"
                allowClear
                showSearch
                onChange={(value: any) => {
                    console.log('value', value);
                }}
            >
                {!isFetching &&
                    data?.clinics.map((clinic: Clinic) => (
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
