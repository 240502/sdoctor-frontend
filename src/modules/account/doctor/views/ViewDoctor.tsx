import { useState, useEffect, useRef } from 'react';
import {
    HomeOutlined,
    EnvironmentOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, notification, Select } from 'antd';
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
import ReactPaginate from 'react-paginate';
import { addWatchedDoctor } from '../../../../utils/doctor';
type NotificationType = 'success' | 'error';
const ViewDoctor = () => {
    const [doctor, setDoctor] = useState<Doctor>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();
    const [api, contextHolder] = notification.useNotification();
    const [majorList, setMajorList] = useState<Major[]>();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);

    const [majorId, setMajorId] = useState<number | null>(0);
    const doctors = useRecoilValue(doctorListValue);
    const setDoctors = useSetRecoilState(doctorListState);

    const loadData = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                majorId: majorId != 0 ? majorId : null,
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
            setMajorList(majorList);
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
        setMajorId(value);
    };
    const changePageSize = (value: any) => {
        setPageIndex(1);
        setPageSize(Number(value));
    };
    const handlePageClick = (event: any) => {
        setPageIndex(event.selected + 1);
    };

    useEffect(() => {
        loadData();
        getAllMajor();
        window.scrollTo(0, 0);
    }, [majorId, pageIndex, pageSize]);

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
                <div className="group__filter mb-3">
                    <Select
                        style={{ width: '20%' }}
                        onChange={handleChangeMajor}
                        showSearch
                        placeholder="Chọn chuyên ngành"
                        optionFilterProp="children"
                        defaultValue={0}
                    >
                        <Select.Option value={0}>
                            Chọn chuyên ngành
                        </Select.Option>
                        {majorList?.map((major: Major) => {
                            return (
                                <Select.Option
                                    key={Number(major.id)}
                                    value={major.id}
                                >
                                    {major.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </div>
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
                                                            baseURL +
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
                                <div className="col-2 list-page">
                                    <ReactPaginate
                                        containerClassName={'pagination'}
                                        className="d-flex m-0 "
                                        breakLabel="..."
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={5}
                                        pageCount={pageCount}
                                        previousLabel={
                                            <Button className="rounded">
                                                <DoubleLeftOutlined />
                                            </Button>
                                        }
                                        nextLabel={
                                            <Button className="rounded">
                                                <DoubleRightOutlined />
                                            </Button>
                                        }
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className="col-2 ms-5">
                                <Select
                                    defaultValue="10"
                                    style={{ width: 120 }}
                                    onChange={changePageSize}
                                    options={[
                                        { value: '5', label: '5' },
                                        { value: '10', label: '10' },
                                        { value: '15', label: '15' },
                                    ]}
                                />
                            </div>
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
