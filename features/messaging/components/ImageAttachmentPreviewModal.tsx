import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { X, Send, Trash2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ImageAttachmentPreviewModalProps {
  visible: boolean
  images: string[]
  onClose: () => void
  onSend: (images: string[], caption: string) => Promise<void> | void
  onRemoveImage?: (index: number) => void
}

export function ImageAttachmentPreviewModal({
  visible,
  images,
  onClose,
  onSend,
  onRemoveImage,
}: ImageAttachmentPreviewModalProps) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [caption, setCaption] = useState('')
  const [sending, setSending] = useState(false)

  const activeIndex = Math.min(selectedIndex, Math.max(0, images.length - 1))
  const activeUri = images[activeIndex]

  const handleClose = () => {
    if (sending) return
    setCaption('')
    setSelectedIndex(0)
    onClose()
  }

  const handleSend = async () => {
    if (images.length === 0 || sending) return
    setSending(true)
    try {
      await onSend(images, caption.trim())
      setCaption('')
      setSelectedIndex(0)
      onClose()
    } finally {
      setSending(false)
    }
  }

  const handleRemove = (index: number) => {
    if (onRemoveImage) {
      onRemoveImage(index)
      if (selectedIndex >= images.length - 1 && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      }
    }
  }

  if (!visible || images.length === 0) return null

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType='fade'
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              disabled={sending}
              style={styles.circleButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={22} color={Colors.white} />
            </TouchableOpacity>

            {images.length > 1 ? (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  {activeIndex + 1} / {images.length}
                </Text>
              </View>
            ) : null}

            {images.length > 1 && onRemoveImage ? (
              <TouchableOpacity
                onPress={() => handleRemove(activeIndex)}
                disabled={sending}
                style={styles.circleButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={20} color='#ef4444' />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>
        </SafeAreaView>

        <View style={styles.previewContainer}>
          {activeUri ? (
            <Image
              source={{ uri: activeUri }}
              style={styles.mainImage}
              resizeMode='contain'
            />
          ) : null}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={styles.bottomContainer}
        >
          {images.length > 1 && (
            <View style={styles.thumbnailsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailsContent}
              >
                {images.map((uri, idx) => {
                  const isCurrent = idx === activeIndex
                  return (
                    <TouchableOpacity
                      key={`${uri}-${idx}`}
                      onPress={() => setSelectedIndex(idx)}
                      style={[
                        styles.thumbnailItem,
                        isCurrent && styles.thumbnailItemActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri }} style={styles.thumbnailImage} />
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          )}

          <View
            style={[
              styles.inputBar,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <View style={styles.inputPill}>
              <TextInput
                style={styles.input}
                placeholder={t(
                  'messaging.preview.caption_placeholder',
                  'Ajouter une légende...',
                )}
                placeholderTextColor='#9ca3af'
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={1000}
                editable={!sending}
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={sending}
              activeOpacity={0.85}
            >
              {sending ? (
                <ActivityIndicator size='small' color={Colors.white} />
              ) : (
                <Send size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: 'transparent',
  },
  thumbnailsWrapper: {
    paddingVertical: Spacing[2],
  },
  thumbnailsContent: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
  },
  thumbnailItem: {
    width: 54,
    height: 54,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  thumbnailItemActive: {
    borderColor: Colors.primary,
    opacity: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[2],
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
  },
  inputPill: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#1f2937',
    borderRadius: 22,
    paddingHorizontal: Spacing[4],
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    justifyContent: 'center',
  },
  input: {
    color: Colors.white,
    fontSize: FontSize.base,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
})
