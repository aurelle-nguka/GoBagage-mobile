import React from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  User,
  Image as ImageIcon,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ChatOptionsMenuProps {
  visible: boolean
  onClose: () => void
  onViewContact: () => void
  onViewMedia: () => void
  onDispute: () => void
  onReport: () => void
}

export function ChatOptionsMenu({
  visible,
  onClose,
  onViewContact,
  onViewMedia,
  onDispute,
  onReport,
}: ChatOptionsMenuProps) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  if (!visible) return null

  const topOffset = insets.top + (Platform.OS === 'ios' ? 46 : 50)

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.menuContainer, { top: topOffset }]}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.65}
            onPress={() => {
              onClose()
              onViewContact()
            }}
          >
            <User size={18} color={Colors.foreground} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>
              {t('messaging.options.view_contact', 'Afficher le contact')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.65}
            onPress={() => {
              onClose()
              onViewMedia()
            }}
          >
            <ImageIcon
              size={18}
              color={Colors.foreground}
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>
              {t('messaging.options.media_links', 'Médias et documents')}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.65}
            onPress={() => {
              onClose()
              onDispute()
            }}
          >
            <AlertTriangle
              size={18}
              color={Colors.warning}
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>
              {t('messaging.options.open_dispute', 'Déclarer un litige')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.65}
            onPress={() => {
              onClose()
              onReport()
            }}
          >
            <ShieldAlert
              size={18}
              color={Colors.destructive}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: Colors.destructive }]}>
              {t('messaging.options.report_user', "Signaler l'utilisateur")}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    right: 12,
    width: 230,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  menuIcon: {
    marginRight: Spacing[3],
  },
  menuItemText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.foreground,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
})
