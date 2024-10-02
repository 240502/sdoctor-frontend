import { useState, useEffect } from 'react';
import {
    HomeOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { Major } from '../../../models/major';
import { MajorService } from '../../../services/majorService';
import { baseURL } from '../../../constants/api';

const ViewSpecialization = () => {
    const [specializations, setSpecializations] = useState<Major[]>();
    const loadData = async () => {
        try {
            const data: Major[] = await MajorService.getAllMajor();
            console.log(data);
            setSpecializations(data);
        } catch (err: any) {
            console.log(err.message);
            setSpecializations([]);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="container home__content mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Khám theo chuyên khoa`,
                    },
                ]}
            />
            <div className="list__specialization row mt-4">
                {specializations?.map((specialization: Major) => {
                    return (
                        <div className="col-3 mb-4">
                            <Link to="" className="text-decoration-none">
                                <Image
                                    preview={false}
                                    src={baseURL + specialization.image}
                                ></Image>
                                <h3
                                    className="specialization__name fs-5 mt-3 text-capitalize"
                                    style={{ color: '#000' }}
                                >
                                    {specialization.name}
                                </h3>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default ViewSpecialization;
