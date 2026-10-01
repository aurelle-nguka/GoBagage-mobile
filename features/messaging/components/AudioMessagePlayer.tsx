import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio'
import { Play, Pause, Mic } from 'lucide-react-native'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'
import { API_BASE_URL } from '../../../shared/constants/api.constants'

interface AudioMessagePlayerProps {
  audioUrl: string
  isMe: boolean
  durationSeconds?: number
}

function resolveAudioUrl(url: string): string {
  if (!url) return ''
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('file://')
  ) {
    return url
  }
  const serverOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${serverOrigin}${url.startsWith('/') ? '' : '/'}${url}`
}

function formatSeconds(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remSec = totalSeconds % 60
  return `${minutes}:${remSec < 10 ? '0' : ''}${remSec}`
}

export function AudioMessagePlayer({
  audioUrl,
  isMe,
  durationSeconds,
}: AudioMessagePlayerProps) {
  const fullUrl = resolveAudioUrl(audioUrl)
  const player = useAudioPlayer(fullUrl, {
    downloadFirst: true,
    updateInterval: 100,
  })
  const status = useAudioPlayerStatus(player)

  const isPlaying = status.playing
  const isBuffering = status.isBuffering
  const currentTime = status.currentTime ?? 0
  const totalDuration =
    status.duration && status.duration > 0
      ? status.duration
      : durationSeconds && durationSeconds > 0
        ? durationSeconds
        : 0

  const handleTogglePlay = async () => {
    try {
      if (isPlaying) {
        player.pause()
      } else {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
          interruptionMode: 'doNotMix',
        })

        if (
          status.didJustFinish ||
          (totalDuration > 0 && currentTime >= totalDuration - 0.2)
        ) {
          await player.seekTo(0)
        }
        player.play()
      }
    } catch (err) {
      console.warn('Audio playback error:', err)
    }
  }

  const handleSeek = async (barIndex: number, totalBars: number) => {
    if (totalDuration <= 0) return
    try {
      const targetTime = (barIndex / totalBars) * totalDuration
      await player.seekTo(targetTime)
      if (!isPlaying) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
          interruptionMode: 'doNotMix',
        })
        player.play()
      }
    } catch (err) {
      console.warn('Audio seek error:', err)
    }
  }

  const progressPercent =
    totalDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100))
      : 0

  const primaryIconColor = isMe ? Colors.primary : Colors.white
  const buttonBgColor = isMe ? Colors.white : Colors.primary
  const textColor = isMe ? Colors.white : Colors.foreground
  const trackBgColor = isMe ? 'rgba(255, 255, 255, 0.35)' : '#d1d5db'
  const trackFillColor = isMe ? Colors.white : Colors.primary

  const waveHeights = [
    10, 16, 10, 22, 14, 20, 12, 18, 12, 24, 16, 12, 20, 14, 10, 16, 10,
  ]

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: buttonBgColor }]}
        onPress={handleTogglePlay}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole='button'
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      >
        {isBuffering && !isPlaying ? (
          <ActivityIndicator size='small' color={primaryIconColor} />
        ) : isPlaying ? (
          <Pause size={16} color={primaryIconColor} fill={primaryIconColor} />
        ) : (
          <Play
            size={16}
            color={primaryIconColor}
            fill={primaryIconColor}
            style={{ marginLeft: 2 }}
          />
        )}
      </TouchableOpacity>

      <View style={styles.rightContent}>
        <View style={styles.waveformRow}>
          {waveHeights.map((h, i) => {
            const barPercent = (i / waveHeights.length) * 100
            const isFilled = progressPercent >= barPercent
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSeek(i, waveHeights.length)}
                hitSlop={{ top: 8, bottom: 8, left: 1, right: 1 }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.waveBar,
                    {
                      height: h,
                      backgroundColor: isFilled ? trackFillColor : trackBgColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: textColor }]}>
            {isPlaying || currentTime > 0
              ? formatSeconds(currentTime)
              : formatSeconds(totalDuration)}
          </Text>
          <Mic size={12} color={textColor} style={{ opacity: 0.7 }} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    minWidth: 190,
    maxWidth: 240,
    gap: Spacing[3],
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  rightContent: {
    flex: 1,
    gap: 4,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 28,
  },
  waveBar: {
    width: 3,
    borderRadius: Radius.full,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
})
