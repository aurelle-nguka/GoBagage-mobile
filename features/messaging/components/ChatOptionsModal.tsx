import React from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  ShieldAlert,
  AlertTriangle,
  User,
  X,
  ChevronRight,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ChatOptionsModalProps {
  visible: boolean
  onClose: () => void
  onReport: () => void
  onDispute: () => void
  onViewProfile?: () => void
  participantName: string
}

export function ChatOptionsModal({
  visible,
  onClose,
  onReport,
  onDispute,
  onViewProfile,
  participantName,
}: ChatOptionsModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('messaging.options.title', 'Options de conversation')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {onViewProfile && (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onClose()
                  onViewProfile()
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: '#e8f4fd' }]}>
                  <User size={18} color={Colors.secondary} />
                </View>
                <View style={styles.itemText}>
                  <Text style={styles.itemTitle}>
                    {t('messaging.options.view_profile', 'Voir le profil')}
                  </Text>
                  <Text style={styles.itemSubtitle}>{participantName}</Text>
                </View>
                <ChevronRight size={18} color={Colors.mutedForeground} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onClose()
                onDispute()
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#fff8e8' }]}>
                <AlertTriangle size={18} color={Colors.warning} />
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>
                  {t('messaging.options.open_dispute', 'Déclarer un litige')}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {t(
                    'messaging.options.dispute_sub',
                    'Signaler un problème sur cette réservation',
                  )}
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onClose()
                onReport()
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#fef2f2' }]}>
                <ShieldAlert size={18} color={Colors.destructive} />
              </View>
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, { color: Colors.destructive }]}>
                  {t('messaging.options.report_user', "Signaler l'utilisateur")}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {t(
                    'messaging.options.report_sub',
                    'Comportement suspect, spam ou fraude',
                  )}
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  list: {
    gap: Spacing[3],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: Radius.xl,
    padding: Spacing[3],
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  itemSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
})
