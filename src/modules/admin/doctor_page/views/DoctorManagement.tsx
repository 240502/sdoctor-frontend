import { useState, useEffect, useMemo } from 'react';
import { Doctor, DoctorOptions } from '../../../../models/doctor';
import {
    Button,
    Flex,
    Divider,
    Breadcrumb,
    message,
    Select,
    Input,
    Upload,
    Row,
    Card,
    Col,
    Tooltip,
    Skeleton,
} from 'antd';
import { HomeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { DoctorCards } from '../components/DoctorCards';
import { DoctorModal } from '../components/DoctorModal';
import { Clinic } from '../../../../models/clinic';
import { RcFile } from 'antd/es/upload';
import { NoticeType } from 'antd/es/message/interface';
import { useNavigate } from 'react-router-dom';
import {
    useDeleteDoctor,
    useFetchAllDepartments,
    useFetchClinicsWithPagination,
    useFetchDoctorForAdmin,
} from '../../../../hooks';
import { Department } from '../../../../models';
import { ConfirmModal } from '../../../../components';
const { Option } = Select;
const { Search } = Input;
const DoctorManagement = () => {
    const navigate = useNavigate();
    const { mutate: deleteDoctor } = useDeleteDoctor();
    const [options, setOptions] = useState<DoctorOptions>({
        pageIndex: 1,
        pageSize: 8,
        clinicId: null,
        majorIds: [],
        doctorServiceIds: [],
        endPrice: null,
        gender: null,
        doctorTitles: [],
        departmentIds: [],
        searchContent: '',
    });
    const { data, isError, error, isFetching, refetch, isRefetching } =
        useFetchDoctorForAdmin(options);

    const [messageApi, contextHolder] = message.useMessage();
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [deletedId, setDeletedId] = useState<number | null>(null);
    const [showDoctorModal, setShowDoctorModal] = useState<boolean>(false);
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const { data: clinicsResponse } = useFetchClinicsWithPagination({});
    const { data: departments } = useFetchAllDepartments();
    const openMessage = (type: NoticeType, content: string) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    const handleClickEditBtn = (doctor: Doctor) => {
        setDoctor(doctor);
        setShowDoctorModal(true);
        setIsUpdate(true);
    };
    const handleClickBtnDelete = (doctor: Doctor) => {
        setShowModalConfirm(true);
        setDeletedId(doctor.doctorId);
    };
    const handleCloseDoctorModal = () => {
        navigate(`/admin/doctor`);
        setShowDoctorModal(false);
        setDoctor({} as Doctor);
        setIsUpdate(false);
    };
    const handleCloseModalConfirm = () => {
        setShowModalConfirm(false);
        setDoctor({} as Doctor);
    };

    const handleChange = (current: number, size: number) => {
        if (size !== options.pageSize) {
            setOptions({ ...options, pageIndex: 1, pageSize: size });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
    };

    const handleShowDoctorModal = () => {
        setShowDoctorModal(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const clinics = useMemo(() => {
        return clinicsResponse?.pages.flatMap((page) => page.data) ?? [];
    }, [clinicsResponse]);

    const handleDeleteDoctor = () => {
        deleteDoctor(deletedId, {
            onSuccess() {
                openMessage('success', 'Xóa thành công!');
                refetch();
                setShowModalConfirm(false);
            },
            onError() {
                openMessage('error', 'Xóa không thành công!');
                setShowModalConfirm(false);
            },
        });
    };
    const beforeUpload = (file: RcFile) => {
        // Kiểm tra định dạng file
        const isExcel =
            file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
            openMessage('error', 'Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div className=" doctor-management">
            {contextHolder}
            <div className="block__filter">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Bác sĩ',
                        },
                    ]}
                />
                <Divider />
            </div>
            <Flex className="justify-content-between ps-2 pe-2 mb-3">
                <h5>Danh sách bác sĩ</h5>
            </Flex>
            <Row gutter={24} className="mb-5">
                <Col span={8}>
                    <Card className="shadow " title="Thao tác nhanh">
                        <Tooltip placement="top" title="Thêm mới">
                            <Button onClick={handleShowDoctorModal}>
                                <PlusOutlined />
                            </Button>
                        </Tooltip>
                        <Upload
                            className="ms-3"
                            beforeUpload={beforeUpload}
                            // customRequest={({ file }) => mutate(file as RcFile)}
                            showUploadList={false}
                        >
                            <Tooltip placement="top" title="Tải lên">
                                <Button>
                                    <UploadOutlined />
                                </Button>
                            </Tooltip>
                        </Upload>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card className="shadow" title="Tìm kiếm">
                        <Flex
                            gap={'middle'}
                            className="justify-content-between"
                        >
                            <Select
                                className="d-block col-3"
                                placeholder="Chọn cơ sở y tế"
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                value={options.clinicId}
                                onChange={(value: any) => {
                                    setOptions({
                                        ...options,
                                        clinicId: value ?? null,
                                    });
                                }}
                            >
                                {clinics.map((clinic: Clinic) => (
                                    <Option
                                        key={clinic.id}
                                        value={clinic.id}
                                        label={clinic.name}
                                    >
                                        {clinic.name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                className="d-block col-3"
                                placeholder="Chọn khoa"
                                optionFilterProp="children"
                                mode="multiple"
                                allowClear
                                showSearch
                                value={options.departmentIds}
                                onChange={(value: number[]) => {
                                    console.log(options.departmentIds);
                                    if (options.departmentIds) {
                                        setOptions({
                                            ...options,
                                            departmentIds: [
                                                ...options.departmentIds,
                                                ...value,
                                            ],
                                        });
                                    }
                                    setOptions({
                                        ...options,
                                        departmentIds: [...value],
                                    });
                                }}
                            >
                                {departments?.departments?.map(
                                    (department: Department) => (
                                        <Option
                                            key={department.id}
                                            value={department.id}
                                            label={department.name}
                                        >
                                            {department.name}
                                        </Option>
                                    )
                                )}
                            </Select>
                            <Flex className="col-4 justify-content-end position-relative">
                                <Search
                                    className="col-12"
                                    placeholder="Tìm kiếm"
                                    onSearch={(value: string) => {
                                        setOptions({
                                            ...options,
                                            searchContent: value,
                                        });
                                    }}
                                ></Search>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
            </Row>

            <Skeleton active loading={isRefetching || isFetching}>
                {isError ? (
                    <p>
                        {error.message.includes('404')
                            ? 'Không có dữ liệu bác sĩ!'
                            : 'Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau !'}
                    </p>
                ) : (
                    <DoctorCards
                        doctors={data?.doctors}
                        pageIndex={options.pageIndex}
                        pageSize={options.pageSize}
                        pageCount={data?.pageCount}
                        handleChange={handleChange}
                        handleClickEditBtn={handleClickEditBtn}
                        handleClickBtnDelete={handleClickBtnDelete}
                    />
                )}
            </Skeleton>

            {showDoctorModal && (
                <DoctorModal
                    showDoctorModal={showDoctorModal}
                    handleCloseDoctorModal={handleCloseDoctorModal}
                    doctor={doctor}
                    setDoctor={setDoctor}
                    openMessage={openMessage}
                    refetch={refetch}
                    isUpdate={isUpdate}
                />
            )}
            {showModalConfirm && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa bác sĩ này?"
                    isOpenModal={showModalConfirm}
                    onCloseModal={handleCloseModalConfirm}
                    handleOk={handleDeleteDoctor}
                />
            )}
        </div>
    );
};
export default DoctorManagement;
