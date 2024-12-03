import axios from 'axios';

export const OtherService = {
    async getProvinces(): Promise<any> {
        try {
            const res = await axios.get(
                'https://vapi.vnappmob.com/api/province'
            );
            return res.data.results;
        } catch (err) {
            console.log(err);
        }
    },
};
