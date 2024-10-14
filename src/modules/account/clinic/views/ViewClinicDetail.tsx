import { Divider, Image, Menu } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BlockDoctor from '../components/BlockDoctor';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { clinicListValue } from '../../../../stores/clinicAtom';
import { Clinic } from '../../../../models/clinic';
import { baseURL } from '../../../../constants/api';
import { ClinicService } from '../../../../services/clinicService';

export const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const clinics = useRecoilValue(clinicListValue);
    const [clinic, setClinic] = useState<Clinic>();
    const [current, setCurrent] = useState<string>('0');
    const sectionDoctorRef = useRef<HTMLDivElement>(null);
    const sectionTop = useRef<HTMLDivElement>(null);

    const scrollToSection = (sectionRef: any) => {
        sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };
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
        scrollToSection(sectionTop);
    }, [id]);

    return (
        <div className=" block__clinic__detail" ref={sectionTop}>
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
                        src={baseURL + clinic?.cover_image}
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
                                    src={baseURL + clinic?.avatar}
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
                            <Menu.Item key={'0'}>Giới thiệu chung</Menu.Item>
                            <Menu.Item
                                key={'1'}
                                onClick={() => {
                                    scrollToSection(sectionDoctorRef);
                                }}
                            >
                                Đặt lịch khám
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className="container block__description mt-5 pt-5">
                <h3 className="text-uppercase fs-5 text-primary mt-3 mb-3">
                    giới thiệu chung
                </h3>
                <p className="fs-6">
                    Phòng Khám ACC - Chiropractic Quận 1 TP.HCM là đơn vị chuyên
                    khoa thần kinh cột sống với đội ngũ các bác sĩ nước ngoài
                    đến từ Mỹ, Canada, Pháp, NewZealand, Hàn Quốc và Nhật Bản
                    giỏi chuyên môn, giàu kinh nghiệm.
                </p>
                <p className="fs-6">
                    {' '}
                    Phòng khám ACC là đơn vị tiên phong trong điều trị các bệnh
                    lý về cột sống, thoát vị đĩa đệm, bệnh lý rễ dây thần kinh
                    bằng phương pháp tự nhiên, không xâm lấn, không dùng thuốc
                    và phẫu thuật.
                </p>
                <h3 className="fw-bold fs-6">Địa chỉ</h3>
                <ul>
                    <li className="fs-6">
                        Cơ sở Quận 1: 99 Nguyễn Du, Phường Bến Thành, Quận 1, Tp
                        Hồ Chí Minh
                    </li>
                </ul>

                <h3 className="fw-bold fs-6">Thời gian làm việc</h3>
                <ul>
                    <li className="fs-6">Thứ 2 - Thứ 6: 7h30 - 17h30</li>
                    <li className="fs-6"> Thứ 7: 7h30 - 12h00</li>
                </ul>
            </div>

            <div className="container block__description mt-4">
                <h3 className="text-uppercase fs-5 text-primary mt-3 mb-3">
                    Thế mạnh chuyên môn
                </h3>
                <p className="fs-6">
                    Phòng khám có thế mạnh trong điều trị không sử dụng thuốc
                    hay phẫu thuật với phương pháp kết hợp giữa trị liệu thần
                    kinh cột sống và các bài tập vật lý trị liệu phục hồi năng.
                    Đặc biệt phù hợp với các bệnh nhân thoát vị đĩa đệm nặng,
                    không thành công với các phương pháp chữa trị thông thường.
                </p>
                <p className="fs-6">
                    Sử dụng liệu trình điều trị thoát vị đĩa đệm cột sống mới:
                    Pneumex PneuBack
                </p>
                <ul>
                    <li className="fs-6">
                        Là phương pháp tiên tiến đang được sử dụng và hiệu quả
                        tại Mỹ và các nước Châu Âu{' '}
                    </li>
                    <li className="fs-6">
                        Liệu trình hoạt động hiệu quả trong khi các phương pháp
                        giảm áp khác không có tác dụng.
                    </li>
                    <li>Kết hợp vật lí trị liệu và phục hồi chức năng</li>
                </ul>
                <h3 className="fw-bold fs-6">Địa chỉ</h3>
                <ul>
                    <li className="fs-6">
                        Cơ sở Quận 1: 99 Nguyễn Du, Phường Bến Thành, Quận 1, Tp
                        Hồ Chí Minh
                    </li>
                </ul>

                <h3 className="fw-bold fs-6">Thời gian làm việc</h3>
                <ul>
                    <li className="fs-6">Thứ 2 - Thứ 6: 7h30 - 17h30</li>
                    <li className="fs-6"> Thứ 7: 7h30 - 12h00</li>
                </ul>
            </div>
            <Divider />
            <div className=" block__doctor" ref={sectionDoctorRef}>
                <BlockDoctor clinicId={id} clinic={clinic} />
            </div>
        </div>
    );
};
