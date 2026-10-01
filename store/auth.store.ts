import { create } from 'zustand';
import { KycStatus, User, UserRole } from '../types/user.types';
import { tokenService } from '../shared/services/token.service';
import apiClient from '../shared/services/api.client';
import { Endpoints } from '../shared/constants/api.constants';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  updateProfilePhoto: (profilePhoto?: string) => void;
  updateKycStatus: (status: KycStatus) => void;
  setSelectedRole: (roles: UserRole[]) => void;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isKycVerified: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:            null,
  isAuthenticated: false,
  isLoading:       true, 

  setUser: (user) =>
    set({ user, isAuthenticated: true, isLoading: false }),

  updateProfilePhoto: (profilePhoto) =>
    set((state) => ({
      user: state.user ? { ...state.user, profilePhoto } : state.user,
    })),

  setSelectedRole: (roles) =>
    set((state) => ({
      user: state.user ? { ...state.user, roles } : state.user,
    })),

  updateKycStatus: (status) =>
    set((state) => ({
      user: state.user ? { ...state.user, kycStatus: status } : state.user,
    })),

  logout: async () => {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      if (refreshToken) {
        await apiClient.post(Endpoints.AUTH_LOGOUT, { refreshToken });
      }
    } catch {
    }
    await tokenService.clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  hasRole: (role) =>
    get().user?.roles.includes(role) ?? false,

  isKycVerified: () =>
    get().user?.kycStatus === 'VERIFIED',
}));
