import { useState, useCallback } from 'react';
import axios from 'axios';

import { useCourses } from './api/useCourses';

import {
    createCourse,
    updateCourse,
    deleteCourse,
} from './api/courseApi';

import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';

import type {
    Course,
    CourseFormValues,
} from './types/course';

import type { ApiErrorResponse } from './types/apiError';


function App() {

    // =========================
    // STATE
    // =========================

    const [keyword, setKeyword] = useState('');

    const [page, setPage] = useState(0);

    // null = đang thêm
    // có dữ liệu = đang sửa
    const [editingCourse, setEditingCourse] =
        useState<Course | null>(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [formError, setFormError] =
        useState<string | null>(null);


    // =========================
    // LẤY DANH SÁCH MÔN HỌC
    // =========================

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(keyword, page);


    // =========================
    // SEARCH
    // =========================

    const handleSearch = useCallback((newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0);
    }, []);


    // =========================
    // XỬ LÝ LỖI SERVER
    // =========================

    const extractErrorMessage = (
        err: unknown
    ): string => {

        if (axios.isAxiosError<ApiErrorResponse>(err)) {

            const data = err.response?.data;

            // Ví dụ:
            // { "message": "Tên môn học đã tồn tại" }

            if (data?.message) {
                return data.message;
            }

            // Ví dụ:
            // {
            //     "tenMonHoc": "Tên môn học không hợp lệ",
            //     "soTinChi": "Số tín chỉ không hợp lệ"
            // }

            if (data) {

                const firstFieldError =
                    Object.values(data).find(
                        (value) =>
                            typeof value === 'string'
                    );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }
        }

        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };


    // =========================
    // THÊM / SỬA MÔN HỌC
    // =========================

    const handleFormSubmit = async (
        values: CourseFormValues
    ) => {

        setSubmitting(true);

        setFormError(null);

        try {

            // Nếu có editingCourse
            // => đang SỬA

            if (editingCourse) {

                await updateCourse(
                    editingCourse.id,
                    values
                );

            } else {

                // Nếu không có editingCourse
                // => đang THÊM

                await createCourse(values);
            }


            // Lưu thành công
            // Đóng chế độ sửa
            setEditingCourse(null);

            // Tải lại danh sách
            refetch();

        } catch (err) {

            // Hiển thị lỗi server
            setFormError(
                extractErrorMessage(err)
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================
    // XÓA MÔN HỌC
    // =========================

    const handleDelete = async (
        course: Course
    ) => {

        // Hỏi xác nhận trước khi xóa
        const confirmed = window.confirm(
            `Xóa môn học "${course.tenMonHoc}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCourse(course.id);

            // Xóa thành công
            // Tải lại danh sách
            refetch();

        } catch (err) {

            alert(
                extractErrorMessage(err)
            );
        }
    };


    // =========================
    // GIAO DIỆN
    // =========================

    return (
        <div
            style={{
                padding: 24,
                fontFamily: 'sans-serif',
                maxWidth: 800,
                margin: '0 auto',
            }}
        >

            <h1>
                Quản lý môn học (Admin)
            </h1>


            {/* =====================
                FORM THÊM / SỬA
            ====================== */}

            <CourseForm
                editingCourse={editingCourse}
                onSubmit={handleFormSubmit}
                onCancel={() =>
                    setEditingCourse(null)
                }
                submitting={submitting}
                serverError={formError}
            />


            {/* =====================
                TÌM KIẾM
            ====================== */}

            <SearchBox
                onSearch={handleSearch}
            />


            {/* =====================
                DANH SÁCH
            ====================== */}

            <div style={{ marginTop: 16 }}>

                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}

                    // Khi bấm Sửa
                    onEdit={setEditingCourse}

                    // Khi bấm Xóa
                    onDelete={handleDelete}
                />

            </div>


            {/* =====================
                PHÂN TRANG
            ====================== */}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>
    );
}

export default App;