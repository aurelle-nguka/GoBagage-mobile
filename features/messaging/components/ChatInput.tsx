/**
 * Go Bagage — ChatInput
 * Champ de saisie de message + bouton pièce jointe + bouton envoyer.
 */

import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Paperclip, Send } from 'lucide-react-native'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

interface ChatInputProps {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
  onAttach: () => void
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
}: ChatInputProps) {
  const canSend = value.trim().length > 0

  return (
    <View style={styles.container}>
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
          placeholder='Write a message...'
          placeholderTextColor='#9ca3af'
          style={styles.input}
          onSubmitEditing={canSend ? onSend : undefined}
          returnKeyType='send'
        />
      </View>

      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.85}
      >
        <Send size={18} color={Colors.white} />
      </TouchableOpacity>
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
  sendButtonDisabled: {
    backgroundColor: '#a7f0c7',
  },
})
