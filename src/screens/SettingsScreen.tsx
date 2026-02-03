import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, GlassButton, CategoryChip } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { useGame } from '../context/GameContext';
import { categories } from '../data/words';
import { CategoryId } from '../types';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useGame();
  
  const [numberOfRounds, setNumberOfRounds] = useState(settings.numberOfRounds);
  const [spyGuessOptions, setSpyGuessOptions] = useState(settings.spyGuessOptions);
  const [numberOfSpies, setNumberOfSpies] = useState(settings.numberOfSpies ?? 1);
  const [pointsForFindingSpy, setPointsForFindingSpy] = useState(settings.pointsForFindingSpy);
  const [pointsForSpyGuessing, setPointsForSpyGuessing] = useState(settings.pointsForSpyGuessing);
  const [pointsForSpyEscape, setPointsForSpyEscape] = useState(settings.pointsForSpyEscape || 1);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(settings.selectedCategories);
  const [timePerRound, setTimePerRound] = useState(settings.timePerRound);
  const [showCategoryHint, setShowCategoryHint] = useState(settings.showCategoryHint);
  const [enableVoting, setEnableVoting] = useState(settings.enableVoting);
  const [enableSpyGuess, setEnableSpyGuess] = useState(settings.enableSpyGuess);

  const toggleCategory = (categoryId: CategoryId) => {
    if (selectedCategories.includes(categoryId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
      } else {
        Alert.alert('ئاگاداری', 'لانیکەم یەک پۆل دەبێت هەڵبژێردراو بێت');
      }
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories.map(c => c.id));
  };

  const saveAndGoBack = () => {
    updateSettings({
      numberOfRounds,
      timePerRound,
      spyGuessOptions,
      numberOfSpies,
      pointsForFindingSpy,
      pointsForSpyGuessing,
      pointsForSpyEscape,
      selectedCategories,
      showCategoryHint,
      enableVoting,
      enableSpyGuess,
    });
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  };

  const NumberSelector = ({
    label,
    value,
    onIncrease,
    onDecrease,
    min,
    max,
    compact = false,
  }: {
    label: string;
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min: number;
    max: number;
    compact?: boolean;
  }) => (
    <View style={[styles.selectorRow, compact && styles.selectorTile]}>
      <Text style={[styles.selectorLabel, compact && styles.selectorLabelCompact]}>{label}</Text>
      <View style={styles.selectorControls}>
        <TouchableOpacity
          onPress={onDecrease}
          style={[styles.selectorButton, value <= min && styles.selectorButtonDisabled]}
          disabled={value <= min}
        >
          <Text style={styles.selectorButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.selectorValue}>{value}</Text>
        <TouchableOpacity
          onPress={onIncrease}
          style={[styles.selectorButton, value >= max && styles.selectorButtonDisabled]}
          disabled={value >= max}
        >
          <Text style={styles.selectorButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ToggleRow = ({
    label,
    value,
    onToggle,
    compact = false,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
    compact?: boolean;
  }) => (
    <View style={[styles.toggleRow, compact && styles.toggleTile]}>
      <Text style={[styles.toggleLabel, compact && styles.toggleLabelCompact]}>{label}</Text>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.togglePill, value ? styles.toggleOn : styles.toggleOff]}
      >
        <View style={[styles.toggleDot, value ? styles.toggleDotOn : styles.toggleDotOff]} />
      </TouchableOpacity>
    </View>
  );

  const formatTimeLabel = (seconds: number) => {
    if (seconds === 0) return 'بێ سنوور';
    const mins = Math.floor(seconds / 60);
    return `${mins} خولەک`;
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={saveAndGoBack} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>ڕێکخستنەکان</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Game Settings */}
          <Text style={styles.sectionTitle}>ڕێکخستنەکانی یاری</Text>
          <GlassCard style={styles.settingsCard}>
            <View style={styles.timeRow}>
              <Text style={styles.selectorLabel}>کاتی گفتوگۆ</Text>
              <View style={styles.timeControls}>
                <TouchableOpacity
                  onPress={() => setTimePerRound(t => Math.max(0, t - 60))}
                  style={[styles.selectorButton, timePerRound <= 0 && styles.selectorButtonDisabled]}
                  disabled={timePerRound <= 0}
                >
                  <Text style={styles.selectorButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.selectorValue}>{formatTimeLabel(timePerRound)}</Text>
                <TouchableOpacity
                  onPress={() => setTimePerRound(t => Math.min(900, t + 60))}
                  style={[styles.selectorButton, timePerRound >= 900 && styles.selectorButtonDisabled]}
                  disabled={timePerRound >= 900}
                >
                  <Text style={styles.selectorButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickTimes}>
              {[0, 120, 180, 300, 480, 600].map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setTimePerRound(value)}
                  style={[styles.quickChip, timePerRound === value && styles.quickChipActive]}
                >
                  <Text style={[styles.quickChipText, timePerRound === value && styles.quickChipTextActive]}>
                    {value === 0 ? 'بێ سنوور' : `${value / 60} خ`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.settingsGrid}>
              <View style={styles.settingTile}>
                <NumberSelector
                  label="ژمارەی گەڕەکان"
                  value={numberOfRounds}
                  onIncrease={() => setNumberOfRounds(n => n + 1)}
                  onDecrease={() => setNumberOfRounds(n => n - 1)}
                  min={1}
                  max={20}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <NumberSelector
                  label="ژمارەی سیخوڕەکان"
                  value={numberOfSpies}
                  onIncrease={() => setNumberOfSpies(n => n + 1)}
                  onDecrease={() => setNumberOfSpies(n => n - 1)}
                  min={1}
                  max={5}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <NumberSelector
                  label="هەڵبژاردنەکانی سیخوڕ"
                  value={spyGuessOptions}
                  onIncrease={() => setSpyGuessOptions(n => n + 1)}
                  onDecrease={() => setSpyGuessOptions(n => n - 1)}
                  min={2}
                  max={8}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <ToggleRow
                  label="پیشاندانی پۆل"
                  value={showCategoryHint}
                  onToggle={() => setShowCategoryHint(v => !v)}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <ToggleRow
                  label="دەنگدان"
                  value={enableVoting}
                  onToggle={() => setEnableVoting(v => !v)}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <ToggleRow
                  label="تەخمینی سیخوڕ"
                  value={enableSpyGuess}
                  onToggle={() => setEnableSpyGuess(v => !v)}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <NumberSelector
                  label="خاڵ دۆزینەوەی سیخوڕ"
                  value={pointsForFindingSpy}
                  onIncrease={() => setPointsForFindingSpy(n => n + 1)}
                  onDecrease={() => setPointsForFindingSpy(n => n - 1)}
                  min={1}
                  max={5}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <NumberSelector
                  label="خاڵ تەخمینی سیخوڕ"
                  value={pointsForSpyGuessing}
                  onIncrease={() => setPointsForSpyGuessing(n => n + 1)}
                  onDecrease={() => setPointsForSpyGuessing(n => n - 1)}
                  min={1}
                  max={5}
                  compact
                />
              </View>

              <View style={styles.settingTile}>
                <NumberSelector
                  label="خاڵ دەربازبوون"
                  value={pointsForSpyEscape}
                  onIncrease={() => setPointsForSpyEscape(n => n + 1)}
                  onDecrease={() => setPointsForSpyEscape(n => n - 1)}
                  min={1}
                  max={5}
                  compact
                />
              </View>
            </View>
          </GlassCard>

          {/* Categories */}
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>پۆلەکان</Text>
            <TouchableOpacity onPress={selectAllCategories}>
              <Text style={styles.selectAllText}>هەموو هەڵبژێرە</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <CategoryChip
                key={category.id}
                name={category.name}
                icon={category.icon}
                color={category.color}
                selected={selectedCategories.includes(category.id)}
                onPress={() => toggleCategory(category.id)}
                style={styles.categoryChip}
              />
            ))}
          </View>

          <Text style={styles.selectedCount}>
            {selectedCategories.length} پۆل هەڵبژێردراوە
          </Text>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <GlassButton
            title="پاشەکەوت بکە"
            onPress={saveAndGoBack}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 28,
    color: Colors.text.primary,
  },
  title: {
    ...Typography.h2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionTitle: {
    ...Typography.h4,
    textAlign: 'right',
    marginBottom: 8,
    marginTop: 10,
    color: Colors.accent.gold,
  },
  settingsCard: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  settingsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  settingTile: {
    width: '48%',
    paddingVertical: 6,
  },
  selectorRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  selectorTile: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
    paddingVertical: 0,
  },
  selectorLabel: {
    ...Typography.body,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontSize: 14,
  },
  selectorLabelCompact: {
    fontSize: 13,
    opacity: 0.9,
  },
  selectorControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  selectorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorButtonDisabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  selectorButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectorValue: {
    ...Typography.h4,
    minWidth: 52,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glass.border,
    marginVertical: 8,
  },
  timeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  timeControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  quickTimes: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  quickChipActive: {
    backgroundColor: Colors.primary.start,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  quickChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  quickChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleLabel: {
    ...Typography.body,
    fontSize: 14,
    textAlign: 'right',
  },
  toggleTile: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
    paddingVertical: 0,
  },
  toggleLabelCompact: {
    fontSize: 13,
    opacity: 0.9,
  },
  togglePill: {
    width: 52,
    height: 28,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: Colors.primary.start,
  },
  toggleOff: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  toggleDotOn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  toggleDotOff: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  categoriesHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  selectAllText: {
    ...Typography.body,
    color: Colors.primary.start,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  categoryChip: {
    width: '31%',
  },
  selectedCount: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.muted,
    marginTop: 10,
  },
  footer: {
    paddingTop: 15,
  },
});

export default SettingsScreen;
