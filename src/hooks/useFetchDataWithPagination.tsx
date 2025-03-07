import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../constants/api';
interface PaginationParams {
    filterOption?: any;
    pageIndex?: number;
    pageSize?: number;
}

interface UseFetchDataWithPaginationProps<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    pageCount: number;
}

export const useFetchDataWithPaginationProps = <T,>(
    apiEndpoint: string,
    payload?: PaginationParams
): UseFetchDataWithPaginationProps<T> => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);

    const prevUrl = useRef<string | null>(null);

    useEffect(() => {
        console.log('payload', payload);
        const fetchData = async () => {
            console.log(
                'prevUrl.current === apiEndpoint && payload?.pageIndex === 1',
                prevUrl.current === apiEndpoint && payload?.pageIndex === 1
            );
            if (prevUrl.current === apiEndpoint && payload?.pageIndex === 1)
                return;

            prevUrl.current = apiEndpoint;
            setLoading(true);
            setError(null);
            try {
                const res = await apiClient.post(apiEndpoint, {
                    ...payload,
                    pageIndex: payload?.pageIndex,
                    pageSize: payload?.pageSize,
                });
                setData(res?.data?.data);
                setPageCount(res?.data?.pageCount);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Error fetching data');
                setData([]);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };
        fetchData();
    }, [apiEndpoint, payload]);

    return {
        data,
        loading,
        error,
        pageCount,
    };
};
