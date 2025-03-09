import { Button } from 'antd';
import '@/assets/scss/loading.scss';
import { useEffect } from 'react';
type Props = {
    isFirstLoading?: boolean;
    loading?: boolean;
    onClick?: () => void;
};
const ShowMoreComp = ({ loading, onClick }: Props) => {
    useEffect(() => {
        console.log('condition', loading);
    }, [loading]);
    return (
        <div className="text-center">
            <Button
                className="text-center bg-primary text-white pt-4 pb-4 fs-6 position-relative"
                onClick={onClick}
            >
                {loading && <div className="ic-loader"></div>}

                <span className="fw-medium">Xem thêm</span>
            </Button>
        </div>
    );
};
export default ShowMoreComp;
