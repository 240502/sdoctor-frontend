import { Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useFetchCommonMedicalPackages } from '../../../../hooks';
import MedicalPackageCardComp from './MedicalPackageCardComp';

export const BlockCommonService = () => {
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
            <Skeleton active loading={isFetching}>
                {error ? (
                    <p className="text-center fw-bold">{error.message}</p>
                ) : (
                    <MedicalPackageCardComp medicalPackages={data} />
                )}
            </Skeleton>
        </div>
    );
};
