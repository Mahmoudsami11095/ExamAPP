export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyResetCodeRequest {
    resetCode: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    password: string;
    rePassword: string;
}

export interface EditProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
