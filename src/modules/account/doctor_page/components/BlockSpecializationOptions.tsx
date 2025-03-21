import { useFetchSpecializationsWithPagination } from '../../../../hooks';
import { Select } from 'antd';
import { Major } from '../../../../models/major';
export const BlockSpecializationOptions = () => {
    const { data, isFetching } = useFetchSpecializationsWithPagination({});
    return (
        <div className="pb-3">
            <h6 className="mb-3">Chuyên khoa</h6>
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
                    data?.majors.map((major: Major) => {
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
