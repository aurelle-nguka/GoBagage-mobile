import { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Plus, Edit2 } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { useAdminCorridors } from '../hooks/useAdminCorridors'
import type { CorridorResponse, CorridorRequest } from '../types/corridor.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface AdminCorridorsScreenProps {
  onBack: () => void
}

const EMPTY_FORM: CorridorRequest = {
  departureCountry: '',
  departureCity: '',
  arrivalCountry: '',
  arrivalCity: '',
  code: '',
  basePricePerKg: undefined,
  regulatoryInfo: '',
}

export function AdminCorridorsScreen({ onBack }: AdminCorridorsScreenProps) {
  const {
    corridors,
    loading,
    refreshing,
    error,
    refresh,
    create,
    update,
    toggle,
  } = useAdminCorridors()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingCorridor, setEditingCorridor] =
    useState<CorridorResponse | null>(null)
  const [form, setForm] = useState<CorridorRequest>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditingCorridor(null)
    setForm(EMPTY_FORM)
    setModalVisible(true)
  }

  const openEdit = (corridor: CorridorResponse) => {
    setEditingCorridor(corridor)
    setForm({
      departureCountry: corridor.departureCountry,
      departureCity: corridor.departureCity,
      arrivalCountry: corridor.arrivalCountry,
      arrivalCity: corridor.arrivalCity,
      code: corridor.code,
      basePricePerKg: corridor.basePricePerKg ?? undefined,
      regulatoryInfo: corridor.regulatoryInfo ?? '',
    })
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!form.departureCity || !form.arrivalCity || !form.code) {
      Alert.alert('Error', 'Please fill all required fields.')
      return
    }
    setSaving(true)
    const ok = editingCorridor
      ? await update(editingCorridor.id, form)
      : await create(form)
    setSaving(false)
    if (ok) setModalVisible(false)
  }

  const handleToggle = async (corridor: CorridorResponse) => {
    await toggle(corridor.id, !corridor.isActive)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={onBack} onAdd={openCreate} />
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header onBack={onBack} onAdd={openCreate} />

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={corridors}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={[styles.card, !item.isActive && styles.cardInactive]}>
              <View style={styles.cardLeft}>
                <View style={styles.routeRow}>
                  <RouteLabel
                    from={item.departureCity}
                    to={item.arrivalCity}
                    size='md'
                    color={item.isActive ? Colors.foreground : '#9ca3af'}
                  />
                  <View
                    style={[
                      styles.codeBadge,
                      {
                        backgroundColor: item.isActive ? '#e8faf0' : '#f3f4f6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.codeText,
                        { color: item.isActive ? Colors.primary : '#9ca3af' },
                      ]}
                    >
                      {item.code}
                    </Text>
                  </View>
                </View>
                <RouteLabel
                  from={item.departureCountry}
                  to={item.arrivalCountry}
                  size='sm'
                  color={item.isActive ? Colors.mutedForeground : '#9ca3af'}
                />
                {item.basePricePerKg && (
                  <Text style={styles.priceText}>
                    Base: ${item.basePricePerKg}/kg
                  </Text>
                )}
              </View>

              <View style={styles.cardRight}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  style={styles.editButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Edit2 size={16} color={Colors.primary} />
                </TouchableOpacity>
                <Switch
                  value={item.isActive}
                  onValueChange={() => handleToggle(item)}
                  trackColor={{ false: '#e5e7eb', true: '#c8f5df' }}
                  thumbColor={item.isActive ? Colors.primary : '#9ca3af'}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No corridors yet.</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={openCreate}
              >
                <Text style={styles.addFirstText}>Add first corridor</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCorridor ? 'Edit Corridor' : 'New Corridor'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <FormField
              label='Code *'
              value={form.code}
              onChangeText={(v) => setForm({ ...form, code: v.toUpperCase() })}
              placeholder='ex: MTL-DLA'
            />

            <FormField
              label='Departure City *'
              value={form.departureCity}
              onChangeText={(v) => setForm({ ...form, departureCity: v })}
              placeholder='Montreal'
            />

            <FormField
              label='Departure Country *'
              value={form.departureCountry}
              onChangeText={(v) => setForm({ ...form, departureCountry: v })}
              placeholder='Canada'
            />

            <FormField
              label='Arrival City *'
              value={form.arrivalCity}
              onChangeText={(v) => setForm({ ...form, arrivalCity: v })}
              placeholder='Douala'
            />

            <FormField
              label='Arrival Country *'
              value={form.arrivalCountry}
              onChangeText={(v) => setForm({ ...form, arrivalCountry: v })}
              placeholder='Cameroun'
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size='small' color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingCorridor ? 'Save Changes' : 'Create Corridor'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

function Header({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Corridors</Text>
      <TouchableOpacity
        onPress={onAdd}
        style={styles.addButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Plus size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  )
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  keyboardType?: any
  multiline?: boolean
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#9ca3af'
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: Spacing[5],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInactive: { opacity: 0.6 },
  cardLeft: { flex: 1 },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: 2,
  },
  codeBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.md,
  },
  codeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  cardSub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  priceText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'center',
    gap: Spacing[2],
  },
  editButton: {
    padding: Spacing[2],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginBottom: Spacing[4],
  },
  addFirstButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
  },
  addFirstText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  // Modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  cancelText: {
    color: Colors.primary,
    fontSize: FontSize.base,
  },
  modalContent: {
    padding: Spacing[5],
    gap: Spacing[4],
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  half: { flex: 1 },
  formField: { gap: Spacing[1] },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  fieldInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  fieldInputMulti: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
})
