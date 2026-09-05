import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const res = await loginApi({
                username,
                password,
            });

            login(res.data);

            navigate('/courses');
        } catch (err) {
            if (
                axios.isAxiosError<ApiErrorResponse>(
                    err
                )
            ) {
                setError(
                    err.response?.data?.message ??
                    'Sai username hoac password'
                );
            } else {
                setError(
                    'Dang nhap that bai'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: '50px auto',
            }}
        >
            <h2>Đăng nhập</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username
                    </label>

                    <input
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div>
                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />
                </div>

                {error && (
                    <p
                        style={{
                            color: '#b91c1c',
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Đang đăng nhập...'
                        : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
}