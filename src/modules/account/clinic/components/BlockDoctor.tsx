import { useState, useEffect } from 'react';
import {
    HomeOutlined,
    EnvironmentOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Image,
    notification,
    Pagination,
    Select,
} from 'antd';
import { Link } from 'react-router-dom';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { ModalOrderAppointment } from '../../doctor/components/ModalOrderAppointment';
import { BlockSchedule } from '../../doctor/components/BlockSchedule';
import { Time } from '../../../../models/time';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorListValue,
} from '../../../../stores/doctorAtom';
import { MajorService } from '../../../../services/majorService';
import { Major } from '../../../../models/major';
type NotificationType = 'success' | 'error';
const BlockDoctor = ({ clinicId, clinic }: any) => {
    const [doctor, setDoctor] = useState<Doctor>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();
    const [api, contextHolder] = notification.useNotification();
    const [majors, setMajors] = useState<Major[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);

    const [majorId, setMajorId] = useState<number | null>(0);
    const doctors = useRecoilValue(doctorListValue);
    const setDoctors = useSetRecoilState(doctorListState);
    const loadData = async () => {
        try {
            console.log('call api');
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                clinicId: Number(clinicId),
                majorId: majorId === 0 ? null : Number(majorId),
            };
            const res = await doctorService.viewDoctor(data);
            setDoctors(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setDoctors([]);
        }
    };
    const handleGetMajorById = async (id: number) => {
        try {
            const major = await MajorService.getMajorById(id);
            setMajors((prevMajors: Major[]) => {
                const existingMajor = prevMajors.find(
                    (item: Major) => item.id === major.id
                );
                if (existingMajor) {
                    return prevMajors;
                } else return [...prevMajors, major];
            });
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        console.log(majors);
    }, [majors]);
    useEffect(() => {
        if (clinic?.major_list) {
            for (let i = 0; i < clinic?.major_list.length; i++) {
                handleGetMajorById(clinic?.major_list[i]);
            }
        }
    }, [clinic]);

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
        console.log(`selected ${value}`);
        setMajorId(value);
    };
    const changePageSize = (value: any) => {
        setPageIndex(1);
        setPageSize(Number(value));
    };

    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };

    useEffect(() => {
        loadData();
    }, [majorId, clinicId, pageIndex, pageSize]);

    return (
        <div className="container home__content mt-4 mb-4">
            {contextHolder}

            <h3 className="block__heading fs-5 fw-bold mt-4 mb-4">
                Danh sách bác sĩ
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
                        {majors?.map((major: Major) => {
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
                {doctors.length > 0 ? (
                    <div className="list__doctor m-0 p-0 ">
                        {doctors?.map((doctor: Doctor) => {
                            return (
                                <div
                                    className="list__item mb-3 p-3 border rounded"
                                    key={Number(doctor.doctor_id)}
                                >
                                    <div className="item_container d-flex pt-1">
                                        <div className="item__left col-6 d-flex border border-start-0 border-bottom-0 border-top-0 pe-3">
                                            <div className="col-3 text-center">
                                                <Link
                                                    to={`/doctor/detail/${doctor.doctor_id}`}
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
                                                    to={`/doctor/detail/${doctor.doctor_id}`}
                                                    className="btn__more text-decoration-none mt-3"
                                                >
                                                    Xem thêm
                                                </Link>
                                            </div>
                                            <div className="col-9 doctor_info">
                                                <h3 className="doctor__name fs-5">
                                                    <Link
                                                        to={`/doctor/detail/${doctor.doctor_id}`}
                                                        className="text-decoration-none"
                                                    >
                                                        {doctor.title}{' '}
                                                        {doctor.full_name}
                                                    </Link>
                                                </h3>
                                                <div className="doctor__des">
                                                    {parse(
                                                        String(doctor.summary)
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
                                                subscriberId={doctor.doctor_id}
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
                                // <div className="col-2 list-page">
                                //     <ReactPaginate
                                //         containerClassName={'pagination'}
                                //         className="d-flex m-0 "
                                //         breakLabel="..."
                                //         onPageChange={handlePageClick}
                                //         pageRangeDisplayed={5}
                                //         pageCount={pageCount}
                                //         previousLabel={
                                //             <Button className="rounded">
                                //                 <DoubleLeftOutlined />
                                //             </Button>
                                //         }
                                //         nextLabel={
                                //             <Button className="rounded">
                                //                 <DoubleRightOutlined />
                                //             </Button>
                                //         }
                                //     />
                                // </div>
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
export default BlockDoctor;
