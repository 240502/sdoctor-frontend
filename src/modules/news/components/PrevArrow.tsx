import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
function PrevArrow(props: any) {
    const { onClick } = props;

    return (
        <Button
            icon={<LeftOutlined />}
            onClick={onClick}
            variant="outlined"
            className="carousel-arrow left-arrow position-absolute start-0 top-50 translate-middle-y"
        />
    );
}
export default PrevArrow;
