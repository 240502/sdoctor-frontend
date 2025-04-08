import { Slider } from 'antd';
import { useRecoilState } from 'recoil';
import { medicalPackageOptionsState } from '../../../../stores/medical_packageAtom';
export const PriceOptionsComp = () => {
    const [medicalPackageOptions, setMedicalPackageOptions] = useRecoilState(
        medicalPackageOptionsState
    );
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
                    if (newValue[0] === newValue[1]) {
                        setMedicalPackageOptions({
                            ...medicalPackageOptions,
                            startPrice: newValue[0],
                            endPrice: null,
                        });
                    } else {
                        setMedicalPackageOptions({
                            ...medicalPackageOptions,
                            startPrice: newValue[0],
                            endPrice: newValue[1],
                        });
                    }
                }}
                step={50000}
                defaultValue={[
                    medicalPackageOptions?.startPrice ?? 0,
                    medicalPackageOptions?.endPrice ?? 20000000,
                ]}
                min={50000}
                max={20000000}
                tooltip={{ formatter: formatCurrency }}
            />
        </div>
    );
};
