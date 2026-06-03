export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type Role = "hospital" | "receiver";

export type BloodGroup =
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";

export const BLOOD_GROUPS: BloodGroup[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

export interface AuthUser {
    id: number;
    email: string;
    role: Role;
    profileId: number;
    name: string;
    blood_group?: BloodGroup;
}

export interface LoginResult {
    token: string;
    user: AuthUser;
}

export interface Sample {
    id: number;
    hospital_id: number;
    blood_group: BloodGroup;
    units: number;
    created_at: string;
    hospital_name: string;
    hospital_address: string;
}

export interface HospitalRequest {
    id: number;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    blood_group: BloodGroup;
    sample_id: number;
    receiver_name: string;
    receiver_phone: string;
}

export interface ReceiverRequest {
    id: number;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    blood_group: BloodGroup;
    sample_id: number;
    hospital_name: string;
    hospital_address: string;
}

interface RequestOptions {
    method?: string;
    body?: unknown;
    token?: string | null;
}

/**
 * Calls the API and returns parsed JSON. Throws an Error whose message is
 * the API's `message` field (or a generic fallback) on any non-2xx status.
 */
export async function apiFetch<T>(
    path: string,
    { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error(
            "Cannot reach the server. Is the backend running on " + API_URL + "?"
        );
    }

    let data: unknown = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (!res.ok) {
        const message =
            (data as { message?: string } | null)?.message ??
            `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data as T;
}

// ===== Endpoint helpers =====

export const api = {
    login: (email: string, password: string) =>
        apiFetch<LoginResult>("/api/auth/login", {
            method: "POST",
            body: { email, password },
        }),

    registerHospital: (body: {
        email: string;
        password: string;
        name: string;
        address: string;
        phone: string;
    }) =>
        apiFetch<{ message: string; userId: number }>(
            "/api/auth/register/hospital",
            { method: "POST", body }
        ),

    registerReceiver: (body: {
        email: string;
        password: string;
        name: string;
        phone: string;
        bloodGroup: BloodGroup;
    }) =>
        apiFetch<{ message: string; userId: number }>(
            "/api/auth/register/receiver",
            { method: "POST", body }
        ),

    listSamples: () => apiFetch<Sample[]>("/api/samples"),

    addSample: (token: string, bloodGroup: BloodGroup, units: number) =>
        apiFetch<{ message: string; id: number }>("/api/samples", {
            method: "POST",
            token,
            body: { bloodGroup, units },
        }),

    requestSample: (token: string, sampleId: number) =>
        apiFetch<{ message: string; id: number }>(`/api/requests/${sampleId}`, {
            method: "POST",
            token,
        }),

    listHospitalRequests: (token: string) =>
        apiFetch<HospitalRequest[]>("/api/requests", { token }),

    listMyRequests: (token: string) =>
        apiFetch<ReceiverRequest[]>("/api/my-requests", { token }),

    updateRequest: (
        token: string,
        requestId: number,
        status: "approved" | "rejected"
    ) =>
        apiFetch<{ message: string; id: number; status: string }>(
            `/api/requests/${requestId}`,
            { method: "PUT", token, body: { status } }
        ),
};
