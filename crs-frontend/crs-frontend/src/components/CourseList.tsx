import type { Course } from "../types/course";
import type { LoadState } from "../api/useCourses";

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;

    // Buổi 8: Sửa và Xóa là không bắt buộc
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;

    // Buổi 9: Đăng ký môn học
    onRegister?: (course: Course) => void;
    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {

    if (state === "loading") {
        return <p>Đang tải danh sách môn học...</p>;
    }

    if (state === "error") {
        return (
            <div style={{ color: "#b91c1c" }}>
                <p>{errorMessage}</p>

                <button onClick={onRetry}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (state === "empty") {
        return (
            <p>
                Không tìm thấy môn học nào phù hợp.
            </p>
        );
    }

    // Hiện cột Thao tác nếu có:
    // Sửa, Xóa hoặc Đăng ký
    const showActions =
        !!onEdit ||
        !!onDelete ||
        !!onRegister;

    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
            }}
        >
            <thead>
            <tr
                style={{
                    textAlign: "left",
                    borderBottom: "2px solid #333",
                }}
            >
                <th>Tên môn học</th>

                <th>Số tín chỉ</th>

                <th>Số chỗ còn lại</th>

                {showActions && (
                    <th>Thao tác</th>
                )}
            </tr>
            </thead>

            <tbody>
            {courses.map((course) => {

                const isRegistering =
                    registeringId === course.id;

                const isFull =
                    course.soChoConLai === 0;

                return (
                    <tr
                        key={course.id}
                        style={{
                            borderBottom:
                                "1px solid #eee",
                        }}
                    >
                        <td>
                            {course.tenMonHoc}
                        </td>

                        <td>
                            {course.soTinChi}
                        </td>

                        <td
                            style={{
                                color:
                                    isFull
                                        ? "#b91c1c"
                                        : "inherit",
                            }}
                        >
                            {course.soChoConLai} /{" "}
                            {course.soChoToiDa}
                        </td>

                        {showActions && (
                            <td>

                                {/* Nút Sửa */}
                                {onEdit && (
                                    <button
                                        onClick={() =>
                                            onEdit(course)
                                        }
                                    >
                                        Sửa
                                    </button>
                                )}

                                {/* Nút Xóa */}
                                {onDelete && (
                                    <button
                                        onClick={() =>
                                            onDelete(course)
                                        }
                                        style={{
                                            marginLeft: 8,
                                            color: "#b91c1c",
                                        }}
                                    >
                                        Xóa
                                    </button>
                                )}

                                {/* Nút Đăng ký - Buổi 9 */}
                                {onRegister && (
                                    <button
                                        onClick={() =>
                                            onRegister(course)
                                        }
                                        disabled={
                                            isFull ||
                                            isRegistering
                                        }
                                        style={{
                                            marginLeft: 8,
                                        }}
                                    >
                                        {isRegistering
                                            ? "Đang đăng ký..."
                                            : isFull
                                                ? "Hết chỗ"
                                                : "Đăng ký"}
                                    </button>
                                )}

                            </td>
                        )}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}