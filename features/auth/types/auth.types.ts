import { UserRole } from "../../../types/user.types";

export type OtpPurpose =
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'SENSITIVE_ACTION';

export type KycDocumentType = 'CNI' | 'PASSPORT';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;    
  password: string;    
  roles: UserRole[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SendOtpDto {
  phone: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;        
  purpose: OtpPurpose;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  phoneVerificationRequired: boolean;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  kycRejectionReason: string | null;
  kycDocumentType: KycDocumentType | null;
  profilePhotoUrl: string | null;
  bio: string | null;
  languages: string[];
  averageRating: number | null;
  totalDeliveries: number;
  badges: string[];
  subscriptionPlan: 'FREE' | 'PREMIUM';
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OtpSendResponse {
  message: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  purpose: OtpPurpose;
}

export interface MessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  details: Array<{ field: string; message: string }> | null;
  timestamp: string;
  path: string;
}
