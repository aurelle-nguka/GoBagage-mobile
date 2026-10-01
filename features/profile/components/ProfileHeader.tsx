import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native'
import { ArrowLeft, Star, Camera, Edit3, BadgeCheck } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { toAbsoluteFileUrl } from '../../../shared/utils/url.utils'
import { uploadAvatar, deleteAvatar } from '../api/users.api'
import { useAuthStore } from '../../../store/auth.store'
import { AvatarActionModal } from './AvatarActionModal'

interface ProfileHeaderProps {
  initials: string
  name: string
  memberSince: string
  averageRating: number
  isVerified: boolean
  profilePhoto?: string | null
  bio?: string | null
  onBack: () => void
  onEditProfile?: () => void
}

export function ProfileHeader({
  initials,
  name,
  memberSince,
  averageRating,
  isVerified,
  profilePhoto,
  bio,
  onBack,
  onEditProfile,
}: ProfileHeaderProps) {
  const { t } = useTranslation()
  const { updateProfilePhoto } = useAuthStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const resolvedPhotoUrl = toAbsoluteFileUrl(profilePhoto)
  const hasPhoto = Boolean(resolvedPhotoUrl)

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          t('profile.avatar.permission_camera_title', {
            defaultValue: 'Accès caméra requis',
          }),
          t('profile.avatar.permission_camera_desc', {
            defaultValue:
              "Veuillez autoriser l'accès à l'appareil photo pour prendre une photo de profil.",
          }),
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processUpload(result.assets[0].uri)
      }
    } catch (err) {
      console.warn('Camera error', err)
      Alert.alert(
        t('profile.avatar.error_title', { defaultValue: 'Erreur' }),
        t('profile.avatar.error_upload', {
          defaultValue: 'Impossible de capturer la photo.',
        }),
      )
    }
  }

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          t('profile.avatar.permission_gallery_title', {
            defaultValue: 'Accès photos requis',
          }),
          t('profile.avatar.permission_gallery_desc', {
            defaultValue:
              "Veuillez autoriser l'accès à vos photos pour choisir une photo de profil.",
          }),
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processUpload(result.assets[0].uri)
      }
    } catch (err) {
      console.warn('Gallery error', err)
    }
  }

  const processUpload = async (uri: string) => {
    setIsLoading(true)
    try {
      const userDto = await uploadAvatar(uri)
      const newPhotoUrl = userDto.profilePhotoUrl ?? undefined
      updateProfilePhoto(newPhotoUrl)
    } catch (err: any) {
      Alert.alert(
        t('profile.avatar.error_title', { defaultValue: 'Erreur' }),
        err?.response?.data?.message ??
          t('profile.avatar.error_upload', {
            defaultValue: 'Impossible de mettre à jour votre photo de profil.',
          }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePhoto = () => {
    Alert.alert(
      t('profile.avatar.delete_confirm_title', {
        defaultValue: 'Supprimer la photo',
      }),
      t('profile.avatar.delete_confirm_desc', {
        defaultValue:
          'Êtes-vous sûr de vouloir supprimer votre photo de profil ?',
      }),
      [
        {
          text: t('common.cancel', { defaultValue: 'Annuler' }),
          style: 'cancel',
        },
        {
          text: t('common.delete', { defaultValue: 'Supprimer' }),
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true)
            try {
              await deleteAvatar()
              updateProfilePhoto(undefined)
            } catch (err: any) {
              Alert.alert(
                t('profile.avatar.error_title', { defaultValue: 'Erreur' }),
                err?.response?.data?.message ??
                  t('profile.avatar.error_delete', {
                    defaultValue: 'Impossible de supprimer la photo de profil.',
                  }),
              )
            } finally {
              setIsLoading(false)
            }
          },
        },
      ],
    )
  }

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color='rgba(255,255,255,0.9)' />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {t('profile.title', { defaultValue: 'Profil' })}
        </Text>
        {onEditProfile ? (
          <TouchableOpacity
            onPress={onEditProfile}
            style={styles.editHeaderButton}
            activeOpacity={0.85}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Edit3 size={15} color={Colors.white} />
            <Text style={styles.editHeaderText}>
              {t('profile.edit', { defaultValue: 'Modifier' })}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            style={styles.avatarTouch}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              {resolvedPhotoUrl ? (
                <Image
                  source={{ uri: resolvedPhotoUrl }}
                  style={styles.avatarImage}
                  resizeMode='cover'
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}

              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size='small' color={Colors.white} />
                </View>
              )}
            </View>

            <View style={styles.cameraBadge}>
              <Camera size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isVerified && <BadgeCheck size={19} color='#00E676' />}
          </View>
          <Text style={styles.memberSince}>
            {t('profile.member_since', {
              date: memberSince,
              defaultValue: `Membre depuis ${memberSince}`,
            })}
          </Text>
          {bio ? (
            <Text style={styles.bioText} numberOfLines={2}>
              "{bio}"
            </Text>
          ) : null}
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                color='#FFD600'
                fill={i < Math.round(averageRating) ? '#FFD600' : 'none'}
              />
            ))}
            <Text style={styles.ratingValue}>
              {averageRating.toFixed(1)} avg
            </Text>
          </View>
        </View>
      </View>

      <AvatarActionModal
        visible={modalVisible}
        hasPhoto={hasPhoto}
        onClose={() => setModalVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onDeletePhoto={handleDeletePhoto}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  topTitle: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  spacer: {
    width: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarTouch: {
    position: 'relative',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#15803d',
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  editHeaderText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  memberSince: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
  },
  bioText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  ratingValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.sm,
    marginLeft: 4,
  },
})
