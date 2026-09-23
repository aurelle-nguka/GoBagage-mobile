/**
 * Go Bagage — PackageDetailsCard
 * Récapitulatif du colis suivi.
 */

import { View, Text, StyleSheet } from 'react-native'
import { Package } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface PackageDetailsCardProps {
  description: string
  category: string
  weightKg: number
  recipientName: string
}

export function PackageDetailsCard({
  description,
  category,
  weightKg,
  recipientName,
}: PackageDetailsCardProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('tracking.package_details', { defaultValue: 'Détails du Colis' })}
      </Text>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Package size={28} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.meta}>
            {t('tracking.category', { defaultValue: 'Catégorie' })}: {category} · {weightKg} kg
          </Text>
          <Text style={styles.recipient}>
            {t('tracking.recipient', { defaultValue: 'Destinataire' })}: {recipientName}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  recipient: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
})
