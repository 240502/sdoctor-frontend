import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetchNonParam<T>(url: string, config?: AxiosRequestConfig) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const response: AxiosResponse<T> = await axios.get(url, config);
                setState({ data: response.data, loading: false, error: null });
            } catch (error: any) {
                setState({
                    data: null,
                    loading: false,
                    error: error.response?.data?.message || error.message,
                });
            }
        };

        fetchData();
    }, [url, config]);

    return state;
}
