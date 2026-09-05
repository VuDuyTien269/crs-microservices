import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import type { Course } from "../types/course";

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getCourses();

                console.log("Dữ liệu courses:", response.data);

                setCourses(response.data.content);
            } catch (err) {
                console.error("Lỗi khi tải courses:", err);
                setError("Không thể tải danh sách khóa học");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Đang tải khóa học...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Danh sách khóa học</h1>

            {courses.length === 0 ? (
                <p>Chưa có khóa học.</p>
            ) : (
                <table
                    border={1}
                    cellPadding={10}
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                    }}
                >
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên môn học</th>
                        <th>Số tín chỉ</th>
                        <th>Số chỗ tối đa</th>
                        <th>Số chỗ còn lại</th>
                    </tr>
                    </thead>

                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.tenMonHoc}</td>
                            <td>{course.soTinChi}</td>
                            <td>{course.soChoToiDa}</td>
                            <td>{course.soChoConLai}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CoursePage;