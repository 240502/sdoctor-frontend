import { Slider } from 'antd';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';

export const PriceOptionsComp = () => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
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
                onChangeComplete={(newValue: number[]) => {
                    console.log(newValue);
                    setDoctorOptions({
                        ...doctorOptions,
                        startPrice: newValue[0],
                        endPrice: newValue[1],
                    });
                }}
                step={50000}
                defaultValue={[
                    doctorOptions?.startPrice ?? 0,
                    doctorOptions?.endPrice ?? 0,
                ]}
                min={50000}
                max={2000000}
                tooltip={{ formatter: formatCurrency }}
            />
        </div>
    );
};
