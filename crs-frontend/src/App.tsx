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
import RegisterCoursePage from "./pages/RegisterCoursePage";

import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                {/* Thanh menu chung */}
                <Navbar />

                <Routes>

                    {/* =========================
                        TRANG ĐĂNG NHẬP
                    ========================== */}

                    <Route
                        path="/login"
                        element={
                            <LoginPage />
                        }
                    />


                    {/* =========================
                        DANH SÁCH MÔN HỌC
                        Public
                    ========================== */}

                    <Route
                        path="/courses"
                        element={
                            <CoursesPage />
                        }
                    />


                    {/* =========================
                        ADMIN
                        Chỉ ADMIN được truy cập
                    ========================== */}

                    <Route
                        element={
                            <ProtectedRoute
                                requiredRole="ADMIN"
                            />
                        }
                    >
                        <Route
                            path="/admin/courses"
                            element={
                                <AdminCoursesPage />
                            }
                        />
                    </Route>


                    {/* =========================
                        STUDENT
                        Chỉ STUDENT được truy cập
                    ========================== */}

                    <Route
                        element={
                            <ProtectedRoute
                                requiredRole="STUDENT"
                            />
                        }
                    >
                        <Route
                            path="/register-course"
                            element={
                                <RegisterCoursePage />
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