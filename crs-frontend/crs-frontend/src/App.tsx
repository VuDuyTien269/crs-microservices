import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import RegisterCoursePage from "./pages/RegisterCoursePage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";

import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                {/* =========================
                    NAVBAR CHUNG
                ========================== */}

                <Navbar />

                <Routes>

                    {/* =========================
                        ĐĂNG NHẬP
                    ========================== */}

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />


                    {/* =========================
                        DANH SÁCH MÔN HỌC
                        PUBLIC
                    ========================== */}

                    <Route
                        path="/courses"
                        element={<CoursesPage />}
                    />


                    {/* =========================
                        ADMIN
                        Chỉ ADMIN mới được vào
                    ========================== */}

                    <Route
                        element={
                            <ProtectedRoute
                                requiredRole="ADMIN"
                            />
                        }
                    >

                        {/* Quản trị môn học */}

                        <Route
                            path="/admin/courses"
                            element={
                                <AdminCoursesPage />
                            }
                        />

                        {/* Quản lý API Key */}

                        <Route
                            path="/admin/api-keys"
                            element={
                                <ApiKeysPage />
                            }
                        />

                    </Route>


                    {/* =========================
                        STUDENT
                        Chỉ STUDENT mới được vào
                    ========================== */}

                    <Route
                        element={
                            <ProtectedRoute
                                requiredRole="STUDENT"
                            />
                        }
                    >

                        {/* Đăng ký học phần */}

                        <Route
                            path="/register-course"
                            element={
                                <RegisterCoursePage />
                            }
                        />

                        {/* Môn học đã đăng ký */}

                        <Route
                            path="/my-registrations"
                            element={
                                <MyRegistrationsPage />
                            }
                        />

                    </Route>


                    {/* =========================
                        ROUTE MẶC ĐỊNH
                    ========================== */}

                    <Route
                        path="*"
                        element={
                            <CoursesPage />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;