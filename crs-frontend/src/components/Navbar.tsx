import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    useAuth,
} from '../context/AuthContext';

export default function Navbar() {
    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            style={{
                display: 'flex',
                gap: 16,
                padding: 12,
                borderBottom:
                    '1px solid #ddd',
                alignItems: 'center',
            }}
        >
            {/* Danh sách môn học */}
            <Link to="/courses">
                Danh sách môn học
            </Link>

            {/* =========================
                ADMIN
            ========================== */}
            {isAuthenticated &&
                user?.role === 'ADMIN' && (
                    <Link to="/admin/courses">
                        Quản trị môn học
                    </Link>
                )}

            {/* =========================
                STUDENT
            ========================== */}
            {isAuthenticated &&
                user?.role === 'STUDENT' && (
                    <>
                        {/* Đăng ký học phần */}
                        <Link to="/register-course">
                            Đăng ký học phần
                        </Link>

                        {/* Môn học đã đăng ký */}
                        <Link to="/my-registrations">
                            Môn học đã đăng ký
                        </Link>
                    </>
                )}

            {/* =========================
                THÔNG TIN NGƯỜI DÙNG
            ========================== */}
            <div
                style={{
                    marginLeft: 'auto',
                }}
            >
                {isAuthenticated ? (
                    <>
                        <span
                            style={{
                                marginRight: 12,
                            }}
                        >
                            Xin chào,{' '}
                            {user?.username}{' '}
                            ({user?.role})
                        </span>

                        <button
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
}