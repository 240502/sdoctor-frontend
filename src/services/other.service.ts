import axios from 'axios';

const otherService = {
    async getProvinces(): Promise<any> {
        try {
            const res = await axios.get(
                'https://vapi.vnappmob.com/api/v2/province'
            );
            return res.data.results;
        } catch (err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    async getDistrictByProvince(provinceId: number | null): Promise<any> {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/v2/province/district/${provinceId}`
            );
            return res.data.results;
        } catch (err: any) {
            throw new Error(err);
        }
    },
    async getWardsByDistrict(districtId: number | null): Promise<any> {
        try {
            const res = await axios.get(
                `https://vapi.vnappmob.com//api/v2/province/ward/${districtId}`
            );
            return res?.data?.results;
        } catch (err: any) {
            throw new Error(err);
        }
    },
};
export default otherService;
