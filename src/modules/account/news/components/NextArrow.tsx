import { RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
function NextArrow(props: any) {
    const { onClick } = props;
    return (
        <Button
            icon={<RightOutlined />}
            onClick={onClick}
            variant="outlined"
            className="carousel-arrow right-arrow position-absolute end-0 top-50 translate-middle-y"
        />
    );
}
export default NextArrow;
