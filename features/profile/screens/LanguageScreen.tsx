import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Check } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { changeAppLanguage } from '../../../i18n'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'zh', label: 'Chinese', native: '中文' },
]

interface LanguageScreenProps {
  onBack: () => void
}

export function LanguageScreen({ onBack }: LanguageScreenProps) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const handleSelect = async (code: string) => {
    await changeAppLanguage(code)
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
        <View>
          <Text style={styles.headerTitle}>
            {t('profile.language', 'Language')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t('language.subtitle', 'Select your preferred language')}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => handleSelect(lang.code)}
              activeOpacity={0.85}
            >
              <View style={styles.langInfo}>
                <Text
                  style={[styles.native, isSelected && styles.nativeSelected]}
                >
                  {lang.native}
                </Text>
                <Text style={styles.label}>{lang.label}</Text>
              </View>
              {isSelected && <Check size={20} color={Colors.primary} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  list: {
    backgroundColor: Colors.white,
    marginTop: Spacing[5],
    marginHorizontal: Spacing[5],
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowSelected: {
    backgroundColor: '#e8faf0',
  },
  langInfo: { gap: 2 },
  native: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  nativeSelected: {
    color: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
})
