import React, { useEffect, useState } from 'react';
import { Service } from '../../../../models/service';
import { ServiceService } from '../../../../services/serviceService';
import { ServiceCard } from '../../../../components';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export const BlockCommonService = () => {
    const [commonServices, setCommonServices] = useState<Service[]>([]);
    useEffect(() => {
        const getCommonService = async () => {
            try {
                const res = await ServiceService.getCommonService();
                setCommonServices(res);
                console.log(res);
            } catch (err: any) {
                setCommonServices([]);
                console.log(err);
            }
        };
        getCommonService();
    }, []);

    return (
        <div className="mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Dịch vụ phổ biến</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">
                    <Link to="/list/service" className="text-decoration-none">
                        Xem thêm
                    </Link>
                </Button>
            </div>

            {commonServices.length > 0 ? (
                <ServiceCard services={commonServices} />
            ) : (
                <p>Không có dịch vụ nào!</p>
            )}
        </div>
    );
};
