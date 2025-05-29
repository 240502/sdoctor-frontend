import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { clinicFilterOptions } from '../../../../stores/clinicAtom';
import { useFetchProvinces } from '../../../../hooks';
import { ProvinceType } from '../../../../models';

const ProvinceOptions = () => {
    const [clinicOptions, setClinicOptions] =
        useRecoilState(clinicFilterOptions);
    const { data: provinces } = useFetchProvinces();
 
    const handleChangeLocation = (value: string) => {
        let province: string = '';
        const cityStr = 'thành phố';
        const provinceStr = 'tỉnh';
        if (value) {
            if (value.toLowerCase().includes('thành phố')) {
                province = value.slice(cityStr.length, value.length);
            }
            if (value.toLowerCase().includes('tỉnh')) {
                province = value.slice(provinceStr.length, value.length);
            }
            const newOptions = { ...clinicOptions, location: province.trim() };
            setClinicOptions(newOptions);
        }
    };
    return (
        <div>
            <h6 className="mb-3">Tỉnh thành</h6>
            <Select
                className="w-100"
                onChange={handleChangeLocation}
                showSearch
                placeholder="Chọn tỉnh thành"
                optionFilterProp="children"
                allowClear
            >
                {provinces?.map((province: ProvinceType) => {
                    return (
                        <Select.Option
                            key={Number(province.province_id)}
                            value={province.province_name}
                        >
                            {province.province_name}
                        </Select.Option>
                    );
                })}
            </Select>
        </div>
    );
};

export default ProvinceOptions;
