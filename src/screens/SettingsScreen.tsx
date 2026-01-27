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
      spyGuessOptions,
      numberOfSpies,
      pointsForFindingSpy,
      pointsForSpyGuessing,
      pointsForSpyEscape,
      selectedCategories,
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
  }: {
    label: string;
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min: number;
    max: number;
  }) => (
    <View style={styles.selectorRow}>
      <Text style={styles.selectorLabel}>{label}</Text>
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
            <NumberSelector
              label="ژمارەی گەڕەکان"
              value={numberOfRounds}
              onIncrease={() => setNumberOfRounds(n => n + 1)}
              onDecrease={() => setNumberOfRounds(n => n - 1)}
              min={1}
              max={20}
            />
            
            <View style={styles.divider} />
            
            <NumberSelector
              label="ژمارەی هەڵبژاردنەکانی سیخوڕ"
              value={spyGuessOptions}
              onIncrease={() => setSpyGuessOptions(n => n + 1)}
              onDecrease={() => setSpyGuessOptions(n => n - 1)}
              min={2}
              max={8}
            />

            <View style={styles.divider} />

            <NumberSelector
              label="ژمارەی سیخوڕەکان"
              value={numberOfSpies}
              onIncrease={() => setNumberOfSpies(n => n + 1)}
              onDecrease={() => setNumberOfSpies(n => n - 1)}
              min={1}
              max={5}
            />
            
            <View style={styles.divider} />
            
            <NumberSelector
              label="خاڵ بۆ دۆزینەوەی سیخوڕ"
              value={pointsForFindingSpy}
              onIncrease={() => setPointsForFindingSpy(n => n + 1)}
              onDecrease={() => setPointsForFindingSpy(n => n - 1)}
              min={1}
              max={5}
            />
            
            <View style={styles.divider} />
            
            <NumberSelector
              label="خاڵ بۆ تەخمینی سیخوڕ"
              value={pointsForSpyGuessing}
              onIncrease={() => setPointsForSpyGuessing(n => n + 1)}
              onDecrease={() => setPointsForSpyGuessing(n => n - 1)}
              min={1}
              max={5}
            />
            
            <View style={styles.divider} />
            
            <NumberSelector
              label="خاڵ بۆ دەربازبوونی سیخوڕ"
              value={pointsForSpyEscape}
              onIncrease={() => setPointsForSpyEscape(n => n + 1)}
              onDecrease={() => setPointsForSpyEscape(n => n - 1)}
              min={1}
              max={5}
            />
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
    paddingBottom: 20,
  },
  sectionTitle: {
    ...Typography.h3,
    textAlign: 'right',
    marginBottom: 16,
    marginTop: 10,
    color: Colors.accent.gold,
  },
  settingsCard: {
    marginBottom: 20,
  },
  selectorRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectorLabel: {
    ...Typography.body,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  selectorControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorButtonDisabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  selectorButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectorValue: {
    ...Typography.h3,
    minWidth: 50,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glass.border,
    marginVertical: 12,
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
    width: '47%',
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
