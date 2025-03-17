import { useEffect, useState } from 'react';
import { Service } from '../../../../models/service';
import { ServiceCard } from '../../../../components';
import { Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useFetchCommonMedicalPackages } from '../../../../hooks';

export const BlockCommonService = () => {
    // const [commonServices, setCommonServices] = useState<Service[]>([]);
    // useEffect(() => {
    //     const getCommonService = async () => {
    //         try {
    //             const res = await ServiceService.getCommonService();
    //             setCommonServices(res);
    //         } catch (err: any) {
    //             setCommonServices([]);
    //             console.log(err);
    //         }
    //     };
    //     getCommonService();
    // }, []);

    const { data, error, isFetching } = useFetchCommonMedicalPackages();

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
            {error ? (
                <p className="text-center fw-bold">{error.message}</p>
            ) : (
                <Skeleton active loading={isFetching}>
                    <ServiceCard services={data} />
                </Skeleton>
            )}
        </div>
    );
};
