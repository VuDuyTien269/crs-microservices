import { useState, useCallback } from "react";
import axios from "axios";

import { useCourses } from "../api/useCourses";

import {
    createCourse,
    updateCourse,
    deleteCourse,
} from "../api/courseApi";

import SearchBox from "../components/SearchBox";
import CourseList from "../components/CourseList";
import Pagination from "../components/Pagination";
import CourseForm from "../components/CourseForm";

import type {
    Course,
    CourseFormValues,
} from "../types/course";

import type { ApiErrorResponse } from "../types/apiError";


export default function AdminCoursesPage() {

    // =========================
    // STATE
    // =========================

    const [keyword, setKeyword] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [editingCourse, setEditingCourse] =
        useState<Course | null>(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [formError, setFormError] =
        useState<string | null>(null);


    // =========================
    // LẤY DANH SÁCH
    // =========================

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(
        keyword,
        page
    );


    // =========================
    // SEARCH
    // =========================

    const handleSearch = useCallback(
        (newKeyword: string) => {
            setKeyword(newKeyword);
            setPage(0);
        },
        []
    );


    // =========================
    // XỬ LÝ LỖI
    // =========================

    const extractErrorMessage = (
        err: unknown
    ): string => {

        if (
            axios.isAxiosError<ApiErrorResponse>(
                err
            )
        ) {
            const data =
                err.response?.data;

            if (data?.message) {
                return data.message;
            }

            if (data) {
                const firstFieldError =
                    Object.values(data).find(
                        (value) =>
                            typeof value === "string"
                    );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }
        }

        return "Đã xảy ra lỗi, vui lòng thử lại.";
    };


    // =========================
    // THÊM / SỬA
    // =========================

    const handleFormSubmit = async (
        values: CourseFormValues
    ) => {

        setSubmitting(true);
        setFormError(null);

        try {

            if (editingCourse) {

                // SỬA
                await updateCourse(
                    editingCourse.id,
                    values
                );

            } else {

                // THÊM
                await createCourse(
                    values
                );
            }

            // Thành công
            setEditingCourse(null);

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
    // XÓA
    // =========================

    const handleDelete = async (
        course: Course
    ) => {

        const confirmed =
            window.confirm(
                `Xóa môn học "${course.tenMonHoc}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCourse(
                course.id
            );

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
                fontFamily: "sans-serif",
                maxWidth: 800,
                margin: "0 auto",
            }}
        >

            <h1>
                Quản trị môn học
            </h1>


            {/* =====================
                TÌM KIẾM
            ====================== */}

            <SearchBox
                onSearch={handleSearch}
            />


            {/* =====================
                FORM THÊM / SỬA
            ====================== */}

            <div
                style={{
                    marginTop: 16,
                }}
            >

                <CourseForm
                    editingCourse={
                        editingCourse
                    }

                    onSubmit={
                        handleFormSubmit
                    }

                    onCancel={() =>
                        setEditingCourse(null)
                    }

                    submitting={
                        submitting
                    }

                    serverError={
                        formError
                    }
                />

            </div>


            {/* =====================
                DANH SÁCH
            ====================== */}

            <div
                style={{
                    marginTop: 16,
                }}
            >

                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}

                    onEdit={
                        setEditingCourse
                    }

                    onDelete={
                        handleDelete
                    }
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