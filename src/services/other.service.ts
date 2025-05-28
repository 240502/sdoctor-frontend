// import axios from 'axios';

// const otherService = {
//     async getProvinces(): Promise<any> {
//         try {
//             const res = await axios.get(
//                 'https://vapi.vnappmob.com/api/v2/province'
//             );
//             return res.data.results;
//         } catch (err: any) {
//             console.log(err);
//             throw new Error(err);
//         }
//     },
//     async getDistrictByProvince(provinceId: number | null): Promise<any> {
//         try {
//             const res = await axios.get(
//                 `https://vapi.vnappmob.com//api/v2/province/district/${provinceId}`
//             );
//             return res.data.results;
//         } catch (err: any) {
//             throw new Error(err);
//         }
//     },
//     async getWardsByDistrict(districtId: number | null): Promise<any> {
//         try {
//             const res = await axios.get(
//                 `https://vapi.vnappmob.com//api/v2/province/ward/${districtId}`
//             );
//             return res?.data?.results;
//         } catch (err: any) {
//             throw new Error(err);
//         }
//     },
// };
// export default otherService;

import axios from 'axios';

// Định nghĩa interface cho dữ liệu trả về
interface Province {
    id: number;
    name: string;
}

interface District {
    id: number;
    name: string;
}

interface Ward {
    id: number;
    name: string;
}

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:400/api', // Sửa cổng thành 400
    maxRedirects: 5,
});

// Đặt tiêu đề mặc định
axiosInstance.defaults.headers.common['Accept'] = 'application/json';
axiosInstance.defaults.headers.common['User-Agent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const otherService = {
    async getProvinces(): Promise<any[]> {
        try {
            console.log('Calling getProvinces'); // Log frontend
            const res = await axiosInstance.get('/province');
            console.log('Provinces fetched:', res.data); // Log dữ liệu
            return res.data.results;
        } catch (err: any) {
            console.error('Error in getProvinces:', err.message);
            if (err.response?.status === 308) {
                const newUrl = err.response.headers.location;
                if (newUrl) {
                    console.log(`Redirecting to: ${newUrl}`);
                    const retryResponse = await axiosInstance.get(
                        newUrl.replace('https://vapi.vnappmob.com/api/v2', '')
                    );
                    return retryResponse.data.results;
                }
                throw new Error('No Location header in 308 response');
            }
            throw new Error('Không thể tải danh sách tỉnh/thành phố');
        }
    },

    async getDistrictByProvince(provinceId: number | null): Promise<any[]> {
        if (!provinceId) {
            throw new Error('Province ID is required');
        }
        try {
            console.log(
                `Calling getDistrictByProvince for provinceId: ${provinceId}`
            );
            const res = await axiosInstance.get(
                `/province/district/${provinceId}`
            );
            return res.data.results;
        } catch (err: any) {
            console.error('Error in getDistrictByProvince:', err.message);
            if (err.response?.status === 308) {
                const newUrl = err.response.headers.location;
                if (newUrl) {
                    console.log(`Redirecting to: ${newUrl}`);
                    const retryResponse = await axiosInstance.get(
                        newUrl.replace('https://vapi.vnappmob.com/api/v2', '')
                    );
                    return retryResponse.data.results;
                }
                throw new Error('No Location header in 308 response');
            }
            throw new Error('Không thể tải danh sách quận/huyện');
        }
    },

    async getWardsByDistrict(districtId: number | null): Promise<any[]> {
        if (!districtId) {
            throw new Error('District ID is required');
        }
        try {
            console.log(
                `Calling getWardsByDistrict for districtId: ${districtId}`
            );
            const res = await axiosInstance.get(`/province/ward/${districtId}`);
            return res.data.results;
        } catch (err: any) {
            console.error('Error in getWardsByDistrict:', err.message);
            if (err.response?.status === 308) {
                const newUrl = err.response.headers.location;
                if (newUrl) {
                    console.log(`Redirecting to: ${newUrl}`);
                    const retryResponse = await axiosInstance.get(
                        newUrl.replace('https://vapi.vnappmob.com/api/v2', '')
                    );
                    return retryResponse.data.results;
                }
                throw new Error('No Location header in 308 response');
            }
            throw new Error('Không thể tải danh sách phường/xã');
        }
    },
};

export default otherService;
