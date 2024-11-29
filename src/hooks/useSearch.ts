import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from '../constants/api';

interface SearchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useSearch<T>(options: any, url: string, config: any) {
    const [state, setState] = useState<SearchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const search = async (
        url: string,
        options: any,
        config?: AxiosRequestConfig
    ) => {
        setState({ data: null, loading: true, error: null });
        try {
            const response: AxiosResponse<T> = await apiClient.post(
                url,
                options,
                config
            );
            setState({ data: response.data, loading: false, error: null });
            return response.data;
        } catch (error: any) {
            setState({
                data: null,
                loading: false,
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    };

    return { ...state, search };
}
