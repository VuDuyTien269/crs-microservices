import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface ApiKey {
    id: number;
    keyValue: string;
    ownerName: string;
    scopes: string;
    status: string;
    expiresAt: string | null;
    createdAt: string;
}

interface CreateApiKeyRequest {
    ownerName: string;
    scopes: string;
    validDays: number | null;
}

export default function ApiKeysPage() {

    // =========================
    // STATE
    // =========================

    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

    const [ownerName, setOwnerName] =
        useState("");

    const [scopes, setScopes] =
        useState<string[]>([]);

    const [validDays, setValidDays] =
        useState<number>(30);

    const [message, setMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================
    // LOAD API KEY
    // =========================

    const loadApiKeys = async () => {

        try {

            const response =
                await axiosClient.get<ApiKey[]>(
                    "/api/api-keys"
                );

            setApiKeys(response.data);

        } catch (error) {

            console.error(
                "Lỗi tải API Key:",
                error
            );

            setErrorMessage(
                "Không thể tải danh sách API Key"
            );
        }
    };


    // =========================
    // LOAD KHI MỞ TRANG
    // =========================

    useEffect(() => {

        loadApiKeys();

    }, []);


    // =========================
    // CHỌN / BỎ SCOPE
    // =========================

    const handleScopeChange = (
        scope: string
    ) => {

        setScopes((current) => {

            if (current.includes(scope)) {

                return current.filter(
                    (item) => item !== scope
                );

            }

            return [
                ...current,
                scope,
            ];
        });
    };


    // =========================
    // CẤP API KEY
    // =========================

    const handleCreate = async () => {

        setMessage("");
        setErrorMessage("");

        // Kiểm tra tên đối tác
        if (!ownerName.trim()) {

            setErrorMessage(
                "Vui lòng nhập tên đối tác"
            );

            return;
        }


        // Kiểm tra Scope
        if (scopes.length === 0) {

            setErrorMessage(
                "Vui lòng chọn ít nhất một Scope"
            );

            return;
        }


        setLoading(true);

        try {

            // =========================
            // QUAN TRỌNG
            // Backend đang dùng String scopes
            //
            // Ví dụ:
            // ["courses:read"]
            //
            // sẽ gửi:
            // "courses:read"
            //
            // Nếu chọn 2:
            // ["courses:read", "registrations:read"]
            //
            // sẽ gửi:
            // "courses:read,registrations:read"
            // =========================

            const request: CreateApiKeyRequest = {

                ownerName:
                    ownerName.trim(),

                scopes:
                    scopes.join(","),

                validDays:
                validDays,
            };


            console.log(
                "Request tạo API Key:",
                request
            );


            await axiosClient.post(
                "/api/api-keys",
                request
            );


            // Thành công

            setMessage(
                "Cấp API Key thành công!"
            );

            setOwnerName("");

            setScopes([]);

            setValidDays(30);

            await loadApiKeys();

        } catch (error: any) {

            console.error(
                "Lỗi cấp API Key:",
                error
            );

            console.error(
                "Response:",
                error.response
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Đã có lỗi xảy ra, vui lòng thử lại"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // THU HỒI API KEY
    // =========================

    const handleRevoke = async (
        id: number
    ) => {

        if (
            !window.confirm(
                "Bạn có chắc muốn thu hồi API Key này?"
            )
        ) {

            return;
        }


        try {

            await axiosClient.delete(
                `/api/api-keys/${id}`
            );


            setMessage(
                "Thu hồi API Key thành công!"
            );

            setErrorMessage("");

            await loadApiKeys();

        } catch (error: any) {

            console.error(
                "Lỗi thu hồi API Key:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Không thể thu hồi API Key"
            );
        }
    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (
        value: string | null
    ) => {

        if (!value) {

            return "Không giới hạn";
        }

        return new Date(value)
            .toLocaleString("vi-VN");
    };


    // =========================
    // GIAO DIỆN
    // =========================

    return (

        <div
            style={{
                maxWidth: 1000,
                margin: "40px auto",
                padding: 20,
            }}
        >

            <h1>
                Quản lý API Key
            </h1>


            <hr />


            {/* =========================
                THÔNG BÁO
            ========================== */}

            {message && (

                <div
                    style={{
                        padding: 12,
                        marginBottom: 15,
                        backgroundColor: "#d4edda",
                        border: "1px solid #c3e6cb",
                        color: "#155724",
                    }}
                >
                    {message}
                </div>

            )}


            {errorMessage && (

                <div
                    style={{
                        padding: 12,
                        marginBottom: 15,
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        color: "#721c24",
                    }}
                >
                    {errorMessage}
                </div>

            )}


            {/* =========================
                CẤP API KEY
            ========================== */}

            <h2>
                Cấp API Key
            </h2>


            <div
                style={{
                    padding: 20,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                }}
            >

                {/* TÊN ĐỐI TÁC */}

                <div
                    style={{
                        marginBottom: 20,
                    }}
                >

                    <label>
                        <strong>
                            Tên đối tác
                        </strong>
                    </label>

                    <br />

                    <input
                        type="text"
                        value={ownerName}
                        onChange={(e) =>
                            setOwnerName(
                                e.target.value
                            )
                        }
                        placeholder="Ví dụ: Test Courses Read"
                        style={{
                            width: 400,
                            padding: 8,
                            marginTop: 5,
                        }}
                    />

                </div>


                {/* SCOPE */}

                <div
                    style={{
                        marginBottom: 20,
                    }}
                >

                    <label>
                        <strong>
                            Scope
                        </strong>
                    </label>

                    <br />

                    {/* courses:read */}

                    <label
                        style={{
                            display: "block",
                            marginTop: 8,
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={scopes.includes(
                                "courses:read"
                            )}
                            onChange={() =>
                                handleScopeChange(
                                    "courses:read"
                                )
                            }
                        />

                        {" "}
                        courses:read

                    </label>


                    {/* registrations:read */}

                    <label
                        style={{
                            display: "block",
                            marginTop: 8,
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={scopes.includes(
                                "registrations:read"
                            )}
                            onChange={() =>
                                handleScopeChange(
                                    "registrations:read"
                                )
                            }
                        />

                        {" "}
                        registrations:read

                    </label>

                </div>


                {/* THỜI HẠN */}

                <div
                    style={{
                        marginBottom: 20,
                    }}
                >

                    <label>
                        <strong>
                            Thời hạn
                        </strong>
                    </label>

                    <br />

                    <select
                        value={validDays}
                        onChange={(e) =>
                            setValidDays(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                        style={{
                            padding: 8,
                            marginTop: 5,
                        }}
                    >

                        <option value={30}>
                            30 ngày
                        </option>

                        <option value={60}>
                            60 ngày
                        </option>

                        <option value={90}>
                            90 ngày
                        </option>

                    </select>

                </div>


                {/* NÚT CẤP */}

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                    }}
                >

                    {loading
                        ? "Đang cấp..."
                        : "Cấp API Key"}

                </button>

            </div>


            {/* =========================
                DANH SÁCH
            ========================== */}

            <h2
                style={{
                    marginTop: 40,
                }}
            >
                Danh sách API Key
            </h2>


            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >

                <thead>

                <tr>

                    <th style={thStyle}>
                        ID
                    </th>

                    <th style={thStyle}>
                        Tên đối tác
                    </th>

                    <th style={thStyle}>
                        API Key
                    </th>

                    <th style={thStyle}>
                        Scope
                    </th>

                    <th style={thStyle}>
                        Ngày tạo
                    </th>

                    <th style={thStyle}>
                        Hết hạn
                    </th>

                    <th style={thStyle}>
                        Trạng thái
                    </th>

                    <th style={thStyle}>
                        Thao tác
                    </th>

                </tr>

                </thead>


                <tbody>

                {apiKeys.length === 0 ? (

                    <tr>

                        <td
                            colSpan={8}
                            style={{
                                ...tdStyle,
                                textAlign: "center",
                            }}
                        >
                            Chưa có API Key
                        </td>

                    </tr>

                ) : (

                    apiKeys.map((item) => (

                        <tr key={item.id}>

                            <td style={tdStyle}>
                                {item.id}
                            </td>

                            <td style={tdStyle}>
                                {item.ownerName}
                            </td>

                            <td style={tdStyle}>
                                {item.keyValue}
                            </td>

                            <td style={tdStyle}>

                                {item.scopes
                                    .split(",")
                                    .map(
                                        (scope) => (
                                            <div
                                                key={scope}
                                            >
                                                {scope}
                                            </div>
                                        )
                                    )}

                            </td>

                            <td style={tdStyle}>
                                {formatDate(
                                    item.createdAt
                                )}
                            </td>

                            <td style={tdStyle}>
                                {formatDate(
                                    item.expiresAt
                                )}
                            </td>

                            <td style={tdStyle}>
                                {item.status}
                            </td>

                            <td style={tdStyle}>

                                {item.status ===
                                "ACTIVE" ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRevoke(
                                                item.id
                                            )
                                        }
                                    >
                                        Thu hồi
                                    </button>

                                ) : (

                                    "Đã thu hồi"

                                )}

                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>
    );
}


// =========================
// STYLE
// =========================

const thStyle = {
    border: "1px solid #ddd",
    padding: 10,
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: 10,
};