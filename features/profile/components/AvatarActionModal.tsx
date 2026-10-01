import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera, Image as ImageIcon, Trash2, X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface AvatarActionModalProps {
  visible: boolean
  hasPhoto: boolean
  onClose: () => void
  onTakePhoto: () => void
  onPickFromGallery: () => void
  onDeletePhoto: () => void
}

export function AvatarActionModal({
  visible,
  hasPhoto,
  onClose,
  onTakePhoto,
  onPickFromGallery,
  onDeletePhoto,
}: AvatarActionModalProps) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.sheet,
                {
                  paddingBottom:
                    Math.max(insets.bottom, Spacing[4]) + Spacing[2],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {t('profile.avatar.title', 'Photo de profil')}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={20} color={Colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onClose()
                    setTimeout(() => {
                      onTakePhoto()
                    }, 300)
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
                    ]}
                  >
                    <Camera size={26} color={Colors.primary} />
                  </View>
                  <Text style={styles.optionLabel}>
                    {t('profile.avatar.camera', 'Caméra')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onClose()
                    setTimeout(() => {
                      onPickFromGallery()
                    }, 300)
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { borderColor: '#bfdbfe', backgroundColor: '#eff6ff' },
                    ]}
                  >
                    <ImageIcon size={26} color='#2563eb' />
                  </View>
                  <Text style={styles.optionLabel}>
                    {t('profile.avatar.gallery', 'Galerie')}
                  </Text>
                </TouchableOpacity>

                {hasPhoto && (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      onClose()
                      setTimeout(() => {
                        onDeletePhoto()
                      }, 300)
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
                      ]}
                    >
                      <Trash2 size={26} color={Colors.destructive} />
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: Colors.destructive },
                      ]}
                    >
                      {t('profile.avatar.delete', 'Supprimer')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius['3xl'],
    borderTopRightRadius: Radius['3xl'],
    paddingTop: Spacing[4],
    paddingHorizontal: Spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[5],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  closeButton: {
    padding: Spacing[1],
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing[3],
  },
  optionItem: {
    alignItems: 'center',
    gap: Spacing[2],
    minWidth: 80,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.foreground,
    textAlign: 'center',
  },
})
