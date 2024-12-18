import {
    Breadcrumb,
    Col,
    Divider,
    Image,
    Input,
    Row,
    Select,
    Tabs,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { clinicListValue } from '../../../../stores/clinicAtom';
import { Clinic } from '../../../../models/clinic';
import { baseURL } from '../../../../constants/api';
import { ClinicService } from '../../../../services/clinicService';
import parse from 'html-react-parser';
import '@/assets/scss/clinic.scss';
import { DoctorCard } from '../../../../components';
import { Doctor } from '../../../../models/doctor';
import { doctorService } from '../../../../services/doctorService';
import {
    EnvironmentOutlined,
    HomeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { BlockDescription } from '../components/BlockDescription';
import { MajorService } from '../../../../services/majorService';
import { Major } from '../../../../models/major';

export const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const clinics = useRecoilValue(clinicListValue);
    const [clinic, setClinic] = useState<Clinic>();
    const [current, setCurrent] = useState<string>('0');
    const sectionDoctorRef = useRef<HTMLDivElement>(null);
    const sectionDescriptionRef = useRef<HTMLDivElement>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [majorId, setMajorId] = useState<number>(0);
    const [searchContent, setSearchContent] = useState<string>('');
    const [majors, setMajors] = useState<Major[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>('1');
    const handleGetClinicById = async (id: number) => {
        try {
            const clinic = clinics.find((item: Clinic) => item.id === id);
            if (clinic) {
                setClinic(clinic);
            } else {
                const res = await ClinicService.getClinicById(id);
                setClinic(res);
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    };
    const handleFilterDoctor = () => {
        console.log('filter');
        if (searchContent === '') {
            setFilteredDoctors(doctors);
        } else {
            const filteredDoctors = doctors.filter((doc: Doctor) =>
                doc.full_name.includes(searchContent)
            );
            setFilteredDoctors(filteredDoctors);
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
    const getDoctors = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                clinicId: Number(id),
                majorId: majorId === 0 ? null : Number(majorId),
            };
            const res = await doctorService.viewDoctor(data);
            setDoctors(res.data);
        } catch (err: any) {
            setDoctors([]);
            console.log(err.message);
        }
    };
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
    };
    useEffect(() => {
        handleGetClinicById(Number(id));
        window.scrollTo(0, 0);
        getAllMajor();
    }, [id]);
    useEffect(() => {
        handleFilterDoctor();
    }, [searchContent, doctors]);
    useEffect(() => {
        if (Number(selectedKey) === 2) {
            getDoctors();
        }
    }, [majorId, selectedKey]);

    return (
        <div className=" clinic-detail ">
            <div className="position-relative container mt-4 mb-4">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Chi tiết cơ sở y tế' },
                    ]}
                />
                <div
                    className="image-cover position-relative overflow-hidden mt-3"
                    style={{ maxHeight: '400px' }}
                >
                    <img
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                        }}
                        // className="position-absolute start-0 end-0 bottom-0"
                        src={
                            clinic?.cover_image?.includes('cloudinary')
                                ? clinic?.cover_image
                                : baseURL + clinic?.cover_image
                        }
                    />
                </div>
                <Row className="clinic-info align-items-center" gutter={24}>
                    <Col
                        span={4}
                        className="rounded-circle clinic-image text-center"
                    >
                        <Image
                            src={clinic?.avatar}
                            preview={false}
                            width={128}
                            className="rounded-circle shadow"
                        ></Image>
                    </Col>
                    <Col span={20} className="pt-3">
                        <h5>{clinic?.name}</h5>
                        <p className="opacity-75">
                            <EnvironmentOutlined /> {clinic?.location}
                        </p>
                    </Col>
                </Row>
            </div>
            <Divider className="divider"></Divider>
            <div className="container">
                <div className="tabs">
                    <Tabs
                        onChange={(key: string) => {
                            setSelectedKey(key);
                        }}
                        className=""
                        onClick={handleChangeMenu}
                        items={[
                            {
                                key: '1',
                                label: 'Giới thiệu chung',
                                children: (
                                    <BlockDescription
                                        description={parse(
                                            String(clinic?.description)
                                        )}
                                    />
                                ),
                            },
                            {
                                key: '2',
                                label: 'Bác sĩ',
                                children: (
                                    <div className="mt-3 mb-3">
                                        <Row className="group-filter-options justify-content-between mb-3">
                                            <Col span={4}>
                                                <Select
                                                    className="w-100"
                                                    placeholder="Chọn chuyên khoa"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    allowClear
                                                    onChange={(
                                                        value: number
                                                    ) => {
                                                        setMajorId(value);
                                                    }}
                                                >
                                                    {majors.map(
                                                        (major: Major) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        major.name
                                                                    }
                                                                    value={
                                                                        major.id
                                                                    }
                                                                >
                                                                    {' '}
                                                                    {major.name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </Col>
                                            <Col
                                                span={4}
                                                className="position-relative group-search"
                                            >
                                                <Input
                                                    placeholder="Tìm kiếm"
                                                    onChange={(e: any) => {
                                                        setSearchContent(
                                                            e.target.value
                                                        );
                                                    }}
                                                ></Input>
                                                <SearchOutlined className="position-absolute search-icon"></SearchOutlined>
                                            </Col>
                                        </Row>
                                        <DoctorCard
                                            doctors={filteredDoctors}
                                            handleUpdateViewsDoctor={
                                                handleUpdateViewsDoctor
                                            }
                                        />
                                    </div>
                                ),
                            },
                        ]}
                    ></Tabs>
                </div>
            </div>
        </div>
    );
};
