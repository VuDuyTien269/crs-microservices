import axiosClient from './axiosClient';
import type { Course, PagedResponse } from '../types/course';
import type { AxiosResponse } from 'axios';

export const getCourses = (
    keyword?: string,
    page: number = 0,
    size: number = 10
): Promise<AxiosResponse<PagedResponse<Course>>> => {
    return axiosClient.get<PagedResponse<Course>>(
        '/api/courses',
        {
            params: {
                keyword,
                page,
                size,
            },
        }
    );
};