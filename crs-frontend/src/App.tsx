import { useEffect, useState } from 'react';
import { getCourses } from './api/courseApi';
import type { Course } from './types/course';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourses()
        .then((res) => {
          console.log('========== API SUCCESS ==========');
          console.log('Response:', res);
          console.log('Data:', res.data);

          setCourses(res.data?.content || []);
        })
        .catch((err) => {
          console.error('========== API ERROR ==========');
          console.error(err);

          if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);

            setError(`Lỗi API: ${err.response.status}`);
          } else {
            console.error('Message:', err.message);

            setError(`Lỗi kết nối: ${err.message}`);
          }
        });
  }, []);

  return (
      <div
          style={{
            padding: '24px',
            fontFamily: 'Arial, sans-serif',
          }}
      >
        <h1>Kiểm tra kết nối CRS qua Gateway</h1>

        {error && (
            <p
                style={{
                  color: 'red',
                  fontSize: '18px',
                }}
            >
              {error}
            </p>
        )}

        {courses.length > 0 ? (
            <div>
              <h2>Danh sách khóa học</h2>

              {courses.map((course) => (
                  <div
                      key={course.id}
                      style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        marginBottom: '10px',
                      }}
                  >
                    <p>
                      <strong>ID:</strong> {course.id}
                    </p>

                    <p>
                      <strong>Tên môn học:</strong> {course.tenMonHoc}
                    </p>

                    <p>
                      <strong>Số tín chỉ:</strong> {course.soTinChi}
                    </p>

                    <p>
                      <strong>Số chỗ tối đa:</strong> {course.soChoToiDa}
                    </p>

                    <p>
                      <strong>Số chỗ còn lại:</strong> {course.soChoConLai}
                    </p>
                  </div>
              ))}
            </div>
        ) : (
            <pre>
          {JSON.stringify(courses, null, 2)}
        </pre>
        )}
      </div>
  );
}

export default App;