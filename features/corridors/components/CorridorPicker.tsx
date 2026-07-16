import { useState, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronDown, Search, X } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { CorridorResponse } from '../types/corridor.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface CorridorPickerProps {
  label?: string
  corridors: CorridorResponse[]
  loading?: boolean
  selected: CorridorResponse | null
  onSelect: (corridor: CorridorResponse) => void
  placeholder?: string
}

export function CorridorPicker({
  label = 'Corridor',
  corridors,
  loading = false,
  selected,
  onSelect,
  placeholder = 'Select a corridor',
}: CorridorPickerProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return corridors
    const q = query.toLowerCase()
    return corridors.filter(
      (c) =>
        c.departureCity.toLowerCase().includes(q) ||
        c.arrivalCity.toLowerCase().includes(q) ||
        c.departureCountry.toLowerCase().includes(q) ||
        c.arrivalCountry.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  }, [corridors, query])

  const handleSelect = (corridor: CorridorResponse) => {
    onSelect(corridor)
    setQuery('')
    setModalVisible(false)
  }

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size='small' color={Colors.primary} />
        ) : selected ? (
          <View style={styles.selectedContent}>
            <RouteLabel
              from={selected.departureCity}
              to={selected.arrivalCity}
              size='md'
            />
            <RouteLabel
              from={selected.departureCountry}
              to={selected.arrivalCountry}
              size='sm'
            />
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <ChevronDown size={18} color={Colors.mutedForeground} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Corridor</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false)
                setQuery('')
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={22} color={Colors.foreground} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={16} color='#9ca3af' />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='Search city or country...'
              placeholderTextColor='#9ca3af'
              style={styles.searchInput}
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps='handled'
            renderItem={({ item }) => {
              const isSelected = selected?.id === item.id
              return (
                <TouchableOpacity
                  style={[
                    styles.corridorRow,
                    isSelected && styles.corridorRowSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.corridorInfo}>
                    <RouteLabel
                      from={item.departureCity}
                      to={item.arrivalCity}
                      size='md'
                      color={isSelected ? Colors.primary : Colors.foreground}
                      arrowColor={
                        isSelected ? Colors.primary : Colors.mutedForeground
                      }
                    />
                    <RouteLabel
                      from={item.departureCountry}
                      to={item.arrivalCountry}
                      size='sm'
                      color={
                        isSelected ? Colors.primary : Colors.mutedForeground
                      }
                    />

                    {item.basePricePerKg && (
                      <Text style={styles.corridorPrice}>
                        Base: ${item.basePricePerKg}/kg
                      </Text>
                    )}
                  </View>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {query ? 'No corridor found' : 'No active corridors'}
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    minHeight: 52,
  },
  selectedContent: { flex: 1 },
  selectedSub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  placeholder: {
    fontSize: FontSize.md,
    color: '#9ca3af',
    flex: 1,
  },
  // Modal
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    margin: Spacing[4],
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  corridorRowSelected: {
    backgroundColor: '#e8faf0',
  },
  corridorInfo: { flex: 1 },
  corridorSub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  corridorPrice: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  checkmark: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    fontSize: FontSize.base,
    color: '#9ca3af',
  },
})
