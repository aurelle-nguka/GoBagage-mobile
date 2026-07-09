import { useAuthStore } from "../../store/auth.store";

export function useKycGuard() {
  const { user } = useAuthStore();

  const kycStatus = user?.kycStatus ?? 'PENDING';
  const isVerified = kycStatus === 'VERIFIED';
  const isPending  = kycStatus === 'PENDING';
  const isUnderReview = kycStatus === 'UNDER_REVIEW';
  const isRejected = kycStatus === 'REJECTED';

  return {
    isVerified,
    kycStatus,
    canTransact: isVerified,     
    needsKyc: isPending,         
    kycInReview: isUnderReview,   
    kycRejected: isRejected,     
  };
}
