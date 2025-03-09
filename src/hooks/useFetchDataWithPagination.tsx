import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../constants/api';
interface Options {
    filterOptions?: any;
    pageIndex?: number;
    pageSize?: number;
}

interface UseFetchDataWithPaginationProps<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    pageCount: number;
    resetFirstFetch: (url: string) => void;
}

export const useFetchDataWithPaginationProps = <T,>(
    apiEndpoint: string,
    payload?: Options,
    preventLoading?: boolean
): UseFetchDataWithPaginationProps<T> => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const errorRef = useRef<string | null>(null);
    const pageCountRef = useRef<number>(0);
    const prevUrl = useRef<string | null>(null);
    const resetFirstFetch = (url: string) => {
        if (prevUrl.current === url) {
            prevUrl.current = null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (prevUrl.current === apiEndpoint && payload?.pageIndex === 1) {
                return;
            }
            if (preventLoading) {
                return;
            }
            if (prevUrl.current) {
                setLoading(true);
            }
            prevUrl.current = apiEndpoint;

            errorRef.current = null;
            try {
                const res = await apiClient.post(apiEndpoint, {
                    ...payload?.filterOptions,
                    pageIndex: payload?.pageIndex,
                    pageSize: payload?.pageSize,
                });
                setData(res?.data?.data);
                pageCountRef.current = res?.data?.pageCount;
            } catch (err: any) {
                errorRef.current =
                    err?.response?.data?.message || 'Error fetching data';
                setData([]);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };
        fetchData();
    }, [apiEndpoint, JSON.stringify(payload)]);

    return {
        data,
        loading: loading,
        error: errorRef.current,
        pageCount: pageCountRef.current,
        resetFirstFetch,
    };
};
