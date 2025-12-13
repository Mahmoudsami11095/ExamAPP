export interface LoginResponse {
    message: string;
    token: string;
    email: string;
}

export interface StatusResponse {
    message: string;
    status: string;
}

export interface InfoResponse {
    message: string;
    info: string;
}

export interface MessageResponse {
    message: string;
}

export interface UserInfoResponse {
    message: string;
    user: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
        isVerified: boolean;
    }
}
