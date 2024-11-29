import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../../../../models/doctor';
import {
    Button,
    Pagination,
    Flex,
    Divider,
    Breadcrumb,
    notification,
    Select,
    Card,
    Input,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../../../constants/api';
import { HomeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useFetchNonParam } from '../../../../hooks/useFecthNonParam';
import { useSearch } from '../../../../hooks/useSearch';
import { doctorService } from '../../../../services/doctorService';
import { DoctorCards } from '../components/DoctorCards';
import { DoctorModal } from '../components/DoctorModal';
import { ModalConfirmDelete } from '../components/ModalConfirmDelete';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { ClinicService } from '../../../../services/clinicService';
import { MajorService } from '../../../../services/majorService';
type NotificationType = 'success' | 'warning' | 'error';
const { Option } = Select;

const DoctorManagement = () => {
    const [api, contextHolder] = notification.useNotification();
    const [options, setOptions] = useState({ clinicId: null, majorId: null });
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>();
    const [showDoctorModal, setShowDoctorModal] = useState<boolean>(false);
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [majors, setMajors] = useState<Major[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [searchContent, setSearchContent] = useState<string>('');
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [totalItem, setTotalItem] = useState<number>(0);
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllMajor = async () => {
        try {
            const res = await MajorService.getAllMajor();
            setMajors(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
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
            const res = await doctorService.viewDoctor(data);
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
        getAllClinic();
        getAllMajor();
        window.scrollTo(0, 0);
    }, [pageIndex, pageSize, options]);

    useEffect(() => {
        if (searchContent !== '') {
            const newDoctors = doctors.filter(
                (doctor: Doctor) =>
                    doctor.full_name
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
    return (
        <div className="container">
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
                <Button
                    className="border-0 text-white bg-primary"
                    onClick={handleShowDoctorModal}
                >
                    <PlusOutlined /> Thêm mới
                </Button>
            </Flex>
            <Divider></Divider>
            <Flex gap={'middle'} className="mb-5 justify-content-between">
                <Flex className="col-5" gap={'middle'}>
                    <div className="col">
                        <Select
                            className="d-block"
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
                    </div>
                    <div className="col">
                        <Select
                            className="d-block"
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
                    </div>
                </Flex>
                <Flex className="col-5 justify-content-end position-relative">
                    <Input
                        className="w-50"
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
                    openNotificationWithIcon={openNotificationWithIcon}
                    getDoctor={getDoctors}
                    isUpdate={isUpdate}
                    clinics={clinics}
                    majors={majors}
                />
            )}
            {showModalConfirm && (
                <ModalConfirmDelete
                    showModalConfirm={showModalConfirm}
                    handleCloseModalConfirm={handleCloseModalConfirm}
                    doctorId={doctor?.id}
                    openNotificationWithIcon={openNotificationWithIcon}
                    getDoctors={getDoctors}
                />
            )}
        </div>
    );
};
export default DoctorManagement;
