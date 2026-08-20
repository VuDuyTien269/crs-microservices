import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";

interface Course {
    id: number;
    code: string;
    name: string;
    description?: string;
}

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);

            const data = await getCourses();

            console.log("Dữ liệu courses:", data);

            setCourses(data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải danh sách khóa học");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Đang tải khóa học...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
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
                        <th>Mã khóa học</th>
                        <th>Tên khóa học</th>
                        <th>Mô tả</th>
                    </tr>
                    </thead>

                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CoursePage;