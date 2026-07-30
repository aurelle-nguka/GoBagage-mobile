import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Upload, X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import {
  PARCEL_PHOTOS_MAX,
  PARCEL_PHOTOS_MIN,
} from '../../../shared/constants/app.constants'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

interface PhotoUploaderProps {
  photos: string[]
  onChange: (photos: string[]) => void
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const { t } = useTranslation()
  const canAddMore = photos.length < PARCEL_PHOTOS_MAX

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('kyc.permission_title', 'Permission required'),
        t(
          'parcel.errors.photo_permission_desc',
          'Go Bagage needs access to your photos to add parcel pictures.',
        ),
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    })

    if (!result.canceled && result.assets[0]) {
      onChange([...photos, result.assets[0].uri])
    }
  }

  const handleRemovePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <View>
      <Text style={styles.label}>
        {t('parcel.photos_label', 'Photos ({{min}} min, {{max}} max)', {
          min: PARCEL_PHOTOS_MIN,
          max: PARCEL_PHOTOS_MAX,
        })}
      </Text>
      <View style={styles.row}>
        {photos.map((uri, i) => (
          <View key={i} style={styles.photoBox}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePhoto(i)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <X size={10} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ))}

        {canAddMore && (
          <TouchableOpacity
            style={styles.addBox}
            onPress={handleAddPhoto}
            activeOpacity={0.8}
          >
            <Upload size={16} color='#9ca3af' />
            <Text style={styles.addLabel}>{t('parcel.add', 'Add')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  photoBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addLabel: {
    fontSize: 9,
    color: '#9ca3af',
  },
})
