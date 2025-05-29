import {
    useFetchAllMedicalPackageCategory,
    useFetchMedicalPackageWithPaginationAndOptions,
    useGetMedicalEquipmentByClinicId,
    useGetWorkingHoursByClinicId,
} from '../../../../hooks';
import { Row, Col, Select, Input, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MedicalPackageCard } from '../../../../components';
import { ServiceCategory } from '../../../../models';
import { useRecoilState } from 'recoil';
import { medicalPackageOptionsState } from '../../../../stores/medical_packageAtom';
import { useEffect, useMemo } from 'react';

const MedicalPackage = ({ clinicId }: {clinicId:number | null}) => {
    const [medicaPackageOptions, setMedicalPackageOptions] = useRecoilState(
        medicalPackageOptionsState
    );
    const { data, error, isFetching } =
        useFetchMedicalPackageWithPaginationAndOptions({
            ...medicaPackageOptions,
            clinicId: clinicId,
        });
    const {
        data: medicalPackageCategory,
        isFetching: isFetchingMedicalPackageCategory,
    } = useFetchAllMedicalPackageCategory();

    const medicalPackages = useMemo(() => {
        return data?.pages.flatMap((page) => page.data);
    }, [data]);
    return (
        <div className="mt-3 mb-3">
            <Row className="group-filter-options justify-content-between  shadow p-3 rounded mb-3">
                <Col span={4}>
                    {!isFetchingMedicalPackageCategory && (
                        <Select
                            className="w-100"
                            placeholder="Chọn loại dịch vụ"
                            optionFilterProp="children"
                            showSearch
                            allowClear
                            onChange={(value: number) => {
                                setMedicalPackageOptions({
                                    ...medicaPackageOptions,
                                    categoryId: value,
                                });
                            }}
                        >
                            {medicalPackageCategory?.map(
                                (category: ServiceCategory) => {
                                    return (
                                        <Select.Option
                                            key={category.name}
                                            value={category.id}
                                        >
                                            {' '}
                                            {category.name}
                                        </Select.Option>
                                    );
                                }
                            )}
                        </Select>
                    )}
                </Col>
                <Col span={4} className="position-relative group-search">
                    <Input
                        placeholder="Tìm kiếm"
                        // onChange={(e: any) => {
                        //     setSearchContent(e.target.value);
                        // }}
                    ></Input>
                    <SearchOutlined className="position-absolute search-icon"></SearchOutlined>
                </Col>
            </Row>
            <Skeleton active loading={isFetching}>
                {error ? (
                    <p className="text-center fw-bold mt-3">
                        {error.message.includes('404')
                            ? 'Không có dữ liệu !'
                            : error.message}
                    </p>
                ) : (
                    <MedicalPackageCard services={medicalPackages} />
                )}
            </Skeleton>

            {/* {pageCount > 1 && (
                <Pagination
                    current={pageIndex}
                    pageSize={pageSize}
                    total={pageSize * pageCount}
                    showSizeChanger
                    pageSizeOptions={['4', '8', '12', '16', '20']}
                    onChange={(current: number, size: number) => {
                        if (pageSize === size) {
                            setPageSize(size);
                            setPageIndex(1);
                        } else {
                            setPageIndex(current);
                        }
                    }}
                />
            )} */}
        </div>
    );
};

export default MedicalPackage;
