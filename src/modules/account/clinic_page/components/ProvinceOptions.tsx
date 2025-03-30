import { useState, useEffect } from 'react';
import { ProvinceType } from '../../../../models';
import axios from 'axios';
import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import { clinicFilterOptions } from '../../../../stores/clinicAtom';

const ProvinceOptions = () => {
    const [clinicOptions, setClinicOptions] =
        useRecoilState(clinicFilterOptions);
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const getProvinces = async () => {
        try {
            const res = await axios.get(
                'https://vapi.vnappmob.com/api/v2/province'
            );
            setProvinces(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getProvinces();
    }, []);
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
                {provinces?.map((province: any) => {
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
