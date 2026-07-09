import { Endpoints } from '../../../shared/constants/api.constants';
import apiClient from '../../../shared/services/api.client';
import type {
  RegisterDto,
  RegisterResponse,
  LoginDto,
  JwtResponse,
  SendOtpDto,
  OtpSendResponse,
  VerifyOtpDto,
  OtpVerifyResponse,
  RefreshTokenDto,
  LogoutDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponse,
  UserDTO,
} from '../types/auth.types';

export async function register(data: RegisterDto): Promise<RegisterResponse> {
  
  const response = await apiClient.post<RegisterResponse>(
    Endpoints.AUTH_REGISTER,
    data,
  );
  return response.data;
}

export async function login(data: LoginDto): Promise<JwtResponse> {
  
  const response = await apiClient.post<JwtResponse>(
    Endpoints.AUTH_LOGIN,
    data,
  );
  return response.data;
}

export async function sendOtp(data: SendOtpDto): Promise<OtpSendResponse> {
  const response = await apiClient.post<OtpSendResponse>(
    Endpoints.AUTH_OTP_SEND,
    data,
  );
  return response.data;
}

export async function verifyOtp(data: VerifyOtpDto): Promise<OtpVerifyResponse> {
  const response = await apiClient.post<OtpVerifyResponse>(
    Endpoints.AUTH_OTP_VERIFY,
    data,
  );
  return response.data;
}

export async function refreshToken(data: RefreshTokenDto): Promise<JwtResponse> {
  const response = await apiClient.post<JwtResponse>(
    Endpoints.AUTH_TOKEN_REFRESH,
    data,
  );
  return response.data;
}

export async function logout(data: LogoutDto): Promise<void> {
  await apiClient.post(Endpoints.AUTH_LOGOUT, data);
}

export async function forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    Endpoints.AUTH_PASSWORD_FORGOT,
    data,
  );
  return response.data;
}

export async function resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    Endpoints.AUTH_PASSWORD_RESET,
    data,
  );
  return response.data;
}

export async function getMyProfile(): Promise<UserDTO> {
  const response = await apiClient.get<UserDTO>(Endpoints.USERS_ME);
  return response.data;
}
