import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SearchHeader } from '../components/SearchHeader';
import { SelectedTravelerSummary } from '../components/SelectedTravelerSummary';
import { ParcelFormSection } from '../components/ParcelFormSection';
import { ParcelCategoryPicker } from '../components/ParcelCategoryPicker';
import { RecipientForm } from '../components/RecipientForm';
import { DeclarationCheckbox } from '../components/DeclarationCheckbox';
import { ElectronicSignaturePad } from '../components/ElectronicSignaturePad';
import { CreateParcelDto } from '../types/parcel.type';
import { ParcelCategory } from '../../../types/common.types';
import { PhotoUploader } from '../components/PhotoUpload';
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner';
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';


interface SelectedTravelerInfo {
  initials: string;
  name: string;
  from: string;
  to: string;
  departureDate: string;
  pricePerKg: number;
  availableKg: number;
}

interface DeclareParcelScreenProps {
  traveler: SelectedTravelerInfo;
  /** Nom complet de l'expéditeur connecté, utilisé pour la signature électronique */
  currentUserFullName: string;
  onBack: () => void;
  onContinueToPayment: (parcel: CreateParcelDto) => void;
}

export function DeclareParcelScreen({
  traveler,
  currentUserFullName,
  onBack,
  onContinueToPayment,
}: DeclareParcelScreenProps) {
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState<ParcelCategory>('CLOTHING');
  const [photos, setPhotos] = useState<string[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [declared, setDeclared] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!description || !weight || !recipientName || !recipientPhone || !recipientAddress) {
      setError('Please fill all required fields.');
      return;
    }
    if (photos.length === 0) {
      setError('Please add at least one photo of your parcel.');
      return;
    }
    if (!declared) {
      setError('Please confirm the declaration checkbox.');
      return;
    }
    if (!signed) {
      setError('Please sign electronically.');
      return;
    }
    setError('');
    setLoading(true);

    // TODO: brancher features/parcels/api/parcels.api.ts → POST /parcels puis POST /parcels/{id}/photos
    const payload: CreateParcelDto = {
      description,
      estimatedWeight: Number(weight),
      category,
      recipientName,
      recipientPhone,
      recipientAddress,
    };

    setTimeout(() => {
      setLoading(false);
      onContinueToPayment(payload);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        title="Declare Your Parcel"
        subtitle={`via ${traveler.name}`}
        onBack={onBack}
      />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <SelectedTravelerSummary
          initials={traveler.initials}
          name={traveler.name}
          from={traveler.from}
          to={traveler.to}
          departureDate={traveler.departureDate}
          pricePerKg={traveler.pricePerKg}
        />

        {/* Parcel info */}
        <ParcelFormSection title="📦 Parcel Details">
          <View>
            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Clothing items, family gifts"
              placeholderTextColor="#9ca3af"
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.fieldLabel}>Weight (kg) *</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 3.5"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={styles.textInput}
            />
            <Text style={styles.maxWeightHint}>
              Max {traveler.availableKg} kg available
            </Text>
          </View>

          <ParcelCategoryPicker selected={category} onSelect={setCategory} />

          <PhotoUploader photos={photos} onChange={setPhotos} />
        </ParcelFormSection>

        {/* Recipient */}
        <ParcelFormSection title="👤 Recipient Details">
          <RecipientForm
            name={recipientName}
            phone={recipientPhone}
            address={recipientAddress}
            onChangeName={setRecipientName}
            onChangePhone={setRecipientPhone}
            onChangeAddress={setRecipientAddress}
          />
        </ParcelFormSection>

        {/* Declaration */}
        <ParcelFormSection title="📋 Legal Declaration">
          <DeclarationCheckbox checked={declared} onToggle={() => setDeclared((v) => !v)} />
          <ElectronicSignaturePad
            signed={signed}
            signerName={currentUserFullName}
            onToggle={() => setSigned((v) => !v)}
          />
        </ParcelFormSection>

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label="Continue to Payment →"
          loadingLabel="Processing..."
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
  fieldLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  maxWeightHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  submitButton: {
    marginBottom: Spacing[8],
  },
});
