import { useState, useEffect } from 'react';
import { Doctor } from '../../../../models/doctor';
import {
    Button,
    Flex,
    Divider,
    Breadcrumb,
    notification,
    message,
    Select,
    Input,
    Upload,
    Row,
    Card,
    Col,
    Tooltip,
} from 'antd';
import {
    HomeOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { doctorService } from '../../../../services';
import { DoctorCards } from '../components/DoctorCards';
import { DoctorModal } from '../components/DoctorModal';
import { ModalConfirmDelete } from '../components/ModalConfirmDelete';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { DoctorService } from '../../../../models/doctor_service';
import {
    useFetchClinicsWithPagination,
    useFetchSpecializationsWithPagination,
} from '../../../../hooks';
import { useFetchAllDoctorService } from '../../../../hooks/doctor_service/useFetchAllDoctorService';
import { RcFile } from 'antd/es/upload';
import { NoticeType } from 'antd/es/message/interface';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const DoctorManagement = () => {
    const navigate = useNavigate();
    const config = useRecoilValue(configValue);
    const [messageApi, contextHolder] = message.useMessage();
    const [options, setOptions] = useState({ clinicId: null, majorId: null });
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>();
    const [showDoctorModal, setShowDoctorModal] = useState<boolean>(false);
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [majors, setMajors] = useState<Major[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);
    const [searchContent, setSearchContent] = useState<string>('');
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [totalItem, setTotalItem] = useState<number>(0);
    const { data: clinicResponse } = useFetchClinicsWithPagination({});
    const { data: doctorServiceResponse } = useFetchAllDoctorService();
    const { data: specializationRes } = useFetchSpecializationsWithPagination(
        {}
    );

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
        setDoctor(doctor);
    };
    const handleCloseDoctorModal = () => {
        setShowDoctorModal(false);
        setDoctor({} as Doctor);
        setIsUpdate(false);
    };
    const handleCloseModalConfirm = () => {
        setShowModalConfirm(false);
        setDoctor({} as Doctor);
    };
    const getDoctors = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                ...options,
            };
            const res = await doctorService.viewDoctorForAdmin(data);

            setPageCount(res.pageCount);
            setDoctors(res.data);
            setTotalItem(res.totalItems);
        } catch (err: any) {
            console.log(err.message);
            setPageCount(0);
            setDoctors([]);
        }
    };
    const handleChange = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };

    const handleShowDoctorModal = () => {
        setShowDoctorModal(true);
    };

    useEffect(() => {
        getDoctors();
        window.scrollTo(0, 0);
    }, [pageIndex, pageSize, options]);

    useEffect(() => {
        if (searchContent !== '') {
            const newDoctors = doctors.filter(
                (doctor: Doctor) =>
                    doctor.fullName
                        .toLocaleLowerCase()
                        .includes(searchContent.toLocaleLowerCase()) ||
                    doctor.title
                        .toLocaleLowerCase()
                        .includes(searchContent.toLocaleLowerCase())
            );
            setFilteredDoctors(newDoctors);
            setPageCount(Math.ceil(newDoctors.length / pageSize));
        } else {
            setPageCount(Math.ceil(totalItem / pageSize));
            setFilteredDoctors(doctors);
        }
    }, [searchContent, doctors]);
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
                                placeholder="Chọn chuyên ngành"
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                value={options.majorId}
                                onChange={(value: any) => {
                                    console.log(value);
                                    setOptions({
                                        ...options,
                                        majorId: value ?? null,
                                    });
                                }}
                            >
                                {majors.map((major: Major) => (
                                    <Option
                                        key={major.id}
                                        value={major.id}
                                        label={major.name}
                                    >
                                        {major.name}
                                    </Option>
                                ))}
                            </Select>
                            <Flex className="col-4 justify-content-end position-relative">
                                <Input
                                    className="col-12"
                                    placeholder="Tìm kiếm"
                                    onChange={(e) => {
                                        setSearchContent(e.target.value);
                                    }}
                                ></Input>
                                <Button className="border-0 position-absolute bg-transparent">
                                    <SearchOutlined />
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
            </Row>

            <DoctorCards
                doctors={filteredDoctors}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                handleChange={handleChange}
                handleClickEditBtn={handleClickEditBtn}
                handleClickBtnDelete={handleClickBtnDelete}
            />
            {showDoctorModal && (
                <DoctorModal
                    showDoctorModal={showDoctorModal}
                    handleCloseDoctorModal={handleCloseDoctorModal}
                    doctor={doctor}
                    setDoctor={setDoctor}
                    openMessage={openMessage}
                    getDoctor={getDoctors}
                    isUpdate={isUpdate}
                    clinics={clinics}
                    majors={majors}
                    config={config}
                    doctorServices={doctorServices}
                />
            )}
            {showModalConfirm && (
                <ModalConfirmDelete
                    showModalConfirm={showModalConfirm}
                    handleCloseModalConfirm={handleCloseModalConfirm}
                    doctorId={doctor?.doctorId}
                    openMessage={openMessage}
                    getDoctors={getDoctors}
                    config={config}
                />
            )}
        </div>
    );
};
export default DoctorManagement;
