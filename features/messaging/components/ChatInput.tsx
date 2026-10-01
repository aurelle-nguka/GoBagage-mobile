import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio'
import { Paperclip, Send, Mic, Trash2, Check } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ChatInputProps {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
  onAttach: () => void
  onSendVoice?: (
    audioUri: string,
    durationSeconds: number,
  ) => Promise<void> | void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
  onSendVoice,
}: ChatInputProps) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const canSendText = value.trim().length > 0

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const timerRef = useRef<any>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isRecording])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleStartRecording = async () => {
    try {
      const { granted } = await requestRecordingPermissionsAsync()
      if (!granted) {
        Alert.alert(
          t('common.permission_denied', 'Permission requise'),
          t(
            'messaging.voice.permission_desc',
            "Veuillez autoriser l'accès au microphone pour envoyer des notes vocales.",
          ),
        )
        return
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      })
      await recorder.prepareToRecordAsync()
      await recorder.record()

      setIsRecording(true)
      setRecordSeconds(0)

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1)
      }, 1000)
    } catch {
      Alert.alert(
        t('common.error', 'Erreur'),
        t(
          'messaging.voice.start_error',
          "Impossible de démarrer l'enregistrement audio.",
        ),
      )
    }
  }

  const handleCancelRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setRecordSeconds(0)

    try {
      await recorder.stop()
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      })
    } catch {}
  }

  const handleStopAndSendRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    const duration = recordSeconds
    setIsRecording(false)
    setRecordSeconds(0)

    try {
      await recorder.stop()
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      })
      const uri = recorder.uri

      if (uri && onSendVoice && duration >= 1) {
        await onSendVoice(uri, duration)
      }
    } catch {
      Alert.alert(
        t('common.error', 'Erreur'),
        t('messaging.voice.send_error', "Échec de l'envoi de la note vocale."),
      )
    }
  }

  if (isRecording) {
    return (
      <View
        style={[
          styles.container,
          styles.recordingContainer,
          { paddingBottom: Math.max(insets.bottom, Spacing[3]) },
        ]}
      >
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={handleCancelRecording}
          activeOpacity={0.8}
        >
          <Trash2 size={20} color='#ef4444' />
        </TouchableOpacity>

        <View style={styles.recordingCenter}>
          <Animated.View style={[styles.redDot, { opacity: pulseAnim }]} />
          <Text style={styles.timerText}>{formatDuration(recordSeconds)}</Text>
          <Text style={styles.recordingLabel}>
            {t('messaging.voice.recording', 'Enregistrement...')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sendVoiceBtn}
          onPress={handleStopAndSendRecording}
          activeOpacity={0.85}
        >
          <Check size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Spacing[3]) },
      ]}
    >
      <TouchableOpacity
        style={styles.attachButton}
        onPress={onAttach}
        activeOpacity={0.8}
      >
        <Paperclip size={18} color={Colors.mutedForeground} />
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('messaging.input_placeholder', 'Write a message...')}
          placeholderTextColor='#9ca3af'
          style={styles.input}
          onSubmitEditing={canSendText ? onSend : undefined}
          returnKeyType='send'
        />
      </View>

      {canSendText ? (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          activeOpacity={0.85}
        >
          <Send size={18} color={Colors.white} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleStartRecording}
          activeOpacity={0.85}
        >
          <Mic size={18} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: -1 },
    elevation: 4,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[4],
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingContainer: {
    backgroundColor: '#18181b',
  },
  trashBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[2],
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  timerText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  recordingLabel: {
    color: '#9ca3af',
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  sendVoiceBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
