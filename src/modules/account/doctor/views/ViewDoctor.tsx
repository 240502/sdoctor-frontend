import { useState, useEffect } from 'react';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Pagination,
    Image,
    notification,
    Select,
    Flex,
    Input,
} from 'antd';
import { Link } from 'react-router-dom';
import '@/assets/scss/doctor.scss';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { BlockSchedule } from '../components/BlockSchedule';
import { Time } from '../../../../models/time';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorListValue,
} from '../../../../stores/doctorAtom';
import { MajorService } from '../../../../services/majorService';
import { Major } from '../../../../models/major';
import { addWatchedDoctor } from '../../../../utils/doctor';
import { Clinic } from '../../../../models/clinic';
import { ClinicService } from '../../../../services/clinicService';
import { SearchProps } from 'antd/es/input';
type NotificationType = 'success' | 'error';
const { Option } = Select;
const { Search } = Input;
const ViewDoctor = () => {
    const [doctor, setDoctor] = useState<Doctor>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();
    const [api, contextHolder] = notification.useNotification();
    const [majors, setMajors] = useState<Major[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [options, setOptions] = useState<any>({
        majorId: null,
        name: null,
        clinicId: null,
    });
    const doctors = useRecoilValue(doctorListValue);
    const setDoctors = useSetRecoilState(doctorListState);
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const loadData = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                ...options,
            };
            const res = await doctorService.viewDoctor(data);
            setDoctors(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setDoctors([]);
        }
    };
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllMajor = async () => {
        try {
            const majorList = await MajorService.getAllMajor();
            setMajors(majorList);
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
    const handleChangeMajor = (value: number) => {
        setOptions({ ...options, majorId: value });
    };

    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        const newOptions = { ...options, name: value };
        setOptions(newOptions);
    };
    useEffect(() => {
        loadData();
        getAllMajor();
        window.scrollTo(0, 0);
    }, [options, pageIndex, pageSize]);
    useEffect(() => {
        getAllClinic();
    }, []);
    return (
        <div className="container home__content mt-4 mb-4">
            {contextHolder}
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Danh sách bác sĩ`,
                    },
                ]}
            />
            <h3 className="block__heading fs-5 fw-bold mt-4 mb-4">
                Bác sĩ nổi bật
            </h3>
            <div className="block__list__doctor">
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
                                {majors?.map((major: Major) => (
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
                        <Search
                            onSearch={onSearch}
                            placeholder="Nhập tên bác sĩ"
                            className=""
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>
                {doctors?.length ? (
                    <div className="list__doctor m-0 p-0 ">
                        {doctors?.map((doctor: Doctor) => {
                            return (
                                <div
                                    className="list__item mb-3 p-3 border rounded"
                                    key={Number(doctor.id)}
                                >
                                    <div className="item_container d-flex pt-1">
                                        <div className="item__left col-6 d-flex border border-start-0 border-bottom-0 border-top-0 pe-3">
                                            <div className="col-3 text-center">
                                                <Link
                                                    onClick={() => {
                                                        handleUpdateViewsDoctor(
                                                            Number(doctor.id)
                                                        );
                                                        addWatchedDoctor(
                                                            doctor
                                                        );
                                                    }}
                                                    to={`/doctor/detail/${doctor.id}`}
                                                >
                                                    <Image
                                                        preview={false}
                                                        style={{
                                                            width: '50%',
                                                        }}
                                                        className="doctor__image rounded-circle"
                                                        src={
                                                            doctor.image.includes(
                                                                'cloudinary'
                                                            )
                                                                ? String(
                                                                      doctor.image
                                                                  )
                                                                : baseURL +
                                                                  doctor.image
                                                        }
                                                    ></Image>
                                                </Link>

                                                <Link
                                                    onClick={() => {
                                                        handleUpdateViewsDoctor(
                                                            Number(doctor.id)
                                                        );
                                                        addWatchedDoctor(
                                                            doctor
                                                        );
                                                    }}
                                                    to={`/doctor/detail/${doctor.id}`}
                                                    className="btn__more text-decoration-none mt-3"
                                                >
                                                    Xem thêm
                                                </Link>
                                            </div>
                                            <div className="col-9 doctor_info">
                                                <h3 className="doctor__name fs-5">
                                                    <Link
                                                        onClick={() => {
                                                            handleUpdateViewsDoctor(
                                                                Number(
                                                                    doctor.id
                                                                )
                                                            );
                                                            addWatchedDoctor(
                                                                doctor
                                                            );
                                                        }}
                                                        to={`/doctor/detail/${doctor.id}`}
                                                        className="text-decoration-none"
                                                    >
                                                        {doctor.title}{' '}
                                                        {doctor.full_name}
                                                    </Link>
                                                </h3>
                                                <div className="doctor__des">
                                                    {parse(
                                                        String(
                                                            doctor.description
                                                        )
                                                    )}
                                                    <p>
                                                        <EnvironmentOutlined className="fs-6 " />
                                                        {doctor.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item__right col-6 ps-3  border border-end-0 border-start-0 border-top-0">
                                            <BlockSchedule
                                                subscriberId={doctor.id}
                                                setIsModalOpen={setIsModalOpen}
                                                doctor={doctor}
                                                setDoctor={setDoctor}
                                                setTime={setTime}
                                                setAppointmentDate={
                                                    setAppointmentDate
                                                }
                                            />

                                            <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                                                <h6 className="opacity-75">
                                                    Địa chỉ phòng khám
                                                </h6>
                                                <h6 className="clinic__name">
                                                    {doctor.clinic_name}
                                                </h6>
                                                <p className="clinic__location fs-6">
                                                    {doctor.location}
                                                </p>
                                            </div>
                                            <div className="fee mt-3">
                                                <span className="opacity-75 fs-6 fw-bold">
                                                    Giá khám:
                                                </span>
                                                <span className="price fs-6 ms-2">
                                                    {doctor.fee.toLocaleString(
                                                        undefined
                                                    )}
                                                    đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <section className="page d-flex justify-content-center align-items-center">
                            {pageCount > 1 ? (
                                <Pagination
                                    showSizeChanger
                                    defaultCurrent={1}
                                    align="center"
                                    current={pageIndex}
                                    pageSize={pageSize}
                                    total={pageCount * pageSize}
                                    pageSizeOptions={['5', '10', '20', '30']}
                                    onChange={(
                                        current: number,
                                        size: number
                                    ) => {
                                        changePage(current, size);
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </section>
                    </div>
                ) : (
                    <p className="fs-5 fw-bold text-center">
                        Không có bác sĩ nào
                    </p>
                )}
            </div>
            {isModalOpen && (
                <ModalOrderAppointment
                    isModalOpen={isModalOpen}
                    doctor={doctor}
                    setIsModalOpen={setIsModalOpen}
                    time={time}
                    date={appointmentDate}
                    openNotificationWithIcon={openNotificationWithIcon}
                />
            )}
        </div>
    );
};
export default ViewDoctor;
