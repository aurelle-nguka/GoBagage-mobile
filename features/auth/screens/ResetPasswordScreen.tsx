import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme';
import { useResetPassword } from '../hooks/useResetPassword';
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton';
import { TextField } from '../../../shared/components/ui/TextField';
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner';

interface ResetPasswordScreenProps {
  initialToken?: string;
  onBack: () => void;
  onDone: () => void;
}

export function ResetPasswordScreen({
  initialToken = '',
  onBack,
  onDone,
}: ResetPasswordScreenProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const { loading, error, submit } = useResetPassword();

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};
    if (!token.trim()) {
      errors.token = t('auth.errors.token_required', 'Reset code or token is required');
    }
    if (!newPassword) {
      errors.newPassword = t('auth.errors.password_required', 'Password is required');
    } else if (newPassword.length < 8) {
      errors.newPassword = t(
        'auth.errors.password_too_short',
        'Password must be at least 8 characters',
      );
    }
    if (!confirmPassword) {
      errors.confirmPassword = t(
        'auth.errors.confirm_password_required',
        'Please confirm your password',
      );
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t(
        'auth.errors.passwords_must_match',
        'Passwords do not match',
      );
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const ok = await submit(token, newPassword, confirmPassword);
    if (ok) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.iconCircle}>
            <CheckCircle2 size={44} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>
            {t('auth.password_reset_success_title', 'Password Reset!')}
          </Text>
          <Text style={styles.successDesc}>
            {t(
              'auth.password_reset_success_desc',
              'Your password has been successfully reset. You can now log in with your new password.',
            )}
          </Text>
          <PrimaryButton
            label={t('auth.back_to_login', 'Back to Login')}
            onPress={onDone}
            style={styles.successButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.title}>
          {t('auth.reset_password_title', 'Set New Password')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'auth.reset_password_subtitle',
            'Enter the reset code you received by email and choose a new password.',
          )}
        </Text>

        <View style={styles.form}>
          <TextField
            label={t('auth.reset_token_label', 'Reset Code / Token')}
            value={token}
            onChangeText={(v) => {
              setToken(v);
              if (fieldErrors.token) {
                setFieldErrors((prev) => ({ ...prev, token: undefined }));
              }
            }}
            placeholder={t('auth.reset_token_placeholder', 'Paste the code received by email')}
            autoCapitalize='none'
            error={fieldErrors.token}
          />

          <TextField
            label={t('auth.new_password', 'New Password')}
            value={newPassword}
            onChangeText={(v) => {
              setNewPassword(v);
              if (fieldErrors.newPassword) {
                setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
              }
            }}
            placeholder={t('auth.new_password_placeholder', '••••••••')}
            secureTextEntry
            autoCapitalize='none'
            error={fieldErrors.newPassword}
          />

          <TextField
            label={t('auth.confirm_password', 'Confirm New Password')}
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            placeholder={t('auth.confirm_password_placeholder', '••••••••')}
            secureTextEntry
            autoCapitalize='none'
            error={fieldErrors.confirmPassword}
          />

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label={t('auth.reset_password_submit', 'Reset Password')}
            loadingLabel={t('auth.loading.resetting', 'Resetting...')}
            loading={loading}
            onPress={handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingTop: Spacing[6] },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  subtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
    marginBottom: Spacing[6],
  },
  form: { gap: Spacing[4] },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  successTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  successDesc: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    marginBottom: Spacing[8],
  },
  successButton: { width: '100%' },
});
