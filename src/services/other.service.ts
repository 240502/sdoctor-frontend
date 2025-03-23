import axios from 'axios';

const otherService = {
    async getProvinces(): Promise<any> {
        try {
            const res = await axios.get(
                'https://vapi.vnappmob.com//api/v2/province'
            );
            return res.data.results;
        } catch (err) {
            console.log(err);
        }
    },
};
export default otherService;
