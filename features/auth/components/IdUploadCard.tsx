import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Camera, CheckCircle } from 'lucide-react-native';
import { Colors } from '../../../theme/colors';
import { Radius, Spacing } from '../../../theme/spacing';
import { FontSize, FontWeight } from '../../../theme/typography';

interface IdUploadCardProps {
  label: string;
  uploadedUri: string | null;
  onPress: () => void;
}

export function IdUploadCard({ label, uploadedUri, onPress }: IdUploadCardProps) {
  const isUploaded = Boolean(uploadedUri);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, isUploaded ? styles.cardUploaded : styles.cardEmpty]}
    >
      <View style={[styles.iconBox, { backgroundColor: isUploaded ? Colors.primary : Colors.inputBackground }]}>
        {isUploaded && uploadedUri ? (
          <Image source={{ uri: uploadedUri }} style={styles.thumbnail} />
        ) : (
          <Camera size={24} color="#9ca3af" />
        )}
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.status, { color: isUploaded ? Colors.primary : '#9ca3af' }]}>
          {isUploaded ? 'Uploaded successfully' : 'Tap to upload photo'}
        </Text>
      </View>

      {isUploaded && <CheckCircle size={20} color={Colors.primary} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    padding: Spacing[4],
    borderRadius: Radius.xl,
    borderWidth: 2,
  },
  cardEmpty: {
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    backgroundColor: '#fafafa',
  },
  cardUploaded: {
    borderStyle: 'solid',
    borderColor: Colors.primary,
    backgroundColor: '#e8faf0',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: 48,
    height: 48,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  status: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
});
