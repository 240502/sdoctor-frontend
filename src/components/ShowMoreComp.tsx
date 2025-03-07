import { Button } from 'antd';
import '@/assets/scss/loading.scss';

type Props = {
    loading?: boolean;
    onClick?: () => void;
};
const ShowMoreComp = ({ loading, onClick }: Props) => {
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
