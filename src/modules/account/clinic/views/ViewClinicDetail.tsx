import { Divider, Image, Menu } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BlockDoctor from '../components/BlockDoctor';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { clinicListValue } from '../../../../stores/clinicAtom';
import { Clinic } from '../../../../models/clinic';
import { baseURL } from '../../../../constants/api';
import { ClinicService } from '../../../../services/clinicService';
import parse from 'html-react-parser';
import '@/assets/scss/clinic.scss';

export const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const clinics = useRecoilValue(clinicListValue);
    const [clinic, setClinic] = useState<Clinic>();
    const [current, setCurrent] = useState<string>('0');
    const sectionDoctorRef = useRef<HTMLDivElement>(null);
    const sectionDescriptionRef = useRef<HTMLDivElement>(null);

    const handleGetClinicById = async (id: number) => {
        try {
            const clinic = clinics.find((item: Clinic) => item.id === id);
            console.log(clinic);
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

    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
    };
    useEffect(() => {
        handleGetClinicById(Number(id));
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className=" block__clinic__detail">
            <div className="position-relative">
                <div
                    className="block__image_cover position-relative overflow-hidden"
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
                <div
                    className="container position-absolute start-50 translate-middle "
                    style={{ top: '100%', maxHeight: '200px' }}
                >
                    <div className="block__header row m-auto ">
                        <div
                            className=" d-flex align-items-center  pt-3 pb-4 bg-light bg-gradient"
                            // style={{ backgroundColor: 'transparent' }}
                        >
                            <div className="avatar col-2 text-center ">
                                <Image
                                    style={{
                                        height: '112px',
                                        width: '160px',
                                        objectFit: 'fill',
                                    }}
                                    className="ps-2 pe-2"
                                    src={
                                        clinic?.avatar?.includes('cloudinary')
                                            ? clinic?.avatar
                                            : baseURL + clinic?.avatar
                                    }
                                    preview={false}
                                />
                            </div>
                            <div className="clinic__name ">
                                <h3>{clinic?.name}</h3>
                                <p className="clinic__location fs-5 m-0">
                                    {clinic?.location}
                                </p>
                            </div>
                        </div>
                        <Menu
                            className=" bg-light fs-6 bg-gradient justify-content-center "
                            mode="horizontal"
                            style={{ width: '100%' }}
                            onClick={handleChangeMenu}
                            selectedKeys={[current]}
                        >
                            <Menu.Item
                                key={'0'}
                                onClick={() => {
                                    sectionDescriptionRef.current?.scrollIntoView(
                                        {
                                            behavior: 'smooth',
                                            block: 'start',
                                        }
                                    );
                                }}
                            >
                                Giới thiệu chung
                            </Menu.Item>
                            <Menu.Item
                                key={'1'}
                                onClick={() => {
                                    sectionDoctorRef.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                }}
                            >
                                Đặt lịch khám
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </div>
            <div
                ref={sectionDescriptionRef}
                className="container block__description  pt-5"
                style={{ marginTop: '100px' }}
            >
                {parse(String(clinic?.description))}
            </div>

            <Divider />
            <div className=" block__doctor" ref={sectionDoctorRef}>
                <BlockDoctor clinicId={id} clinic={clinic} />
            </div>
        </div>
    );
};
