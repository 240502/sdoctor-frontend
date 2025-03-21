import { Slider } from 'antd';

export const PriceOptionsComp = () => {
    const formatCurrency = (value?: number) => {
        if (value === undefined) return ''; // Xử lý trường hợp undefined
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };
    return (
        <div className="mb-3">
            <h6 className="mb-3">Giá khám</h6>
            <Slider
                range
                value={[100000, 500000]}
                defaultValue={[100000, 2000000]}
                min={50000}
                max={2000000}
                tooltip={{ formatter: formatCurrency }}
            />
        </div>
    );
};
