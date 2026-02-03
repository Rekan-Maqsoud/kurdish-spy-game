import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassButton, GlassCard, GlassInput } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { getTotalCategoryCount, getTotalWordCount } from '../data/words';

const { width } = Dimensions.get('window');
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1468349946502582304/42-YE7WGvKDIq6NLHztMF5eSI20WRkukBUZ6KVEpKs7I43iDDnv4un-jc40lHON1PWaA';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionContact, setSuggestionContact] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [sendingSuggestion, setSendingSuggestion] = useState(false);

  const resetSuggestionForm = () => {
    setSuggestionName('');
    setSuggestionContact('');
    setSuggestionMessage('');
  };

  const handleSendSuggestion = async () => {
    const message = suggestionMessage.trim();
    if (!message) {
      Alert.alert('ئاگاداری', 'تکایە پێشنیارەکەت بنووسە');
      return;
    }

    try {
      setSendingSuggestion(true);
      const payload = {
        username: 'Spy Suggestions',
        embeds: [
          {
            title: 'New Suggestion',
            color: 0x7c3aed,
            fields: [
              {
                name: 'Name',
                value: suggestionName.trim() || 'Anonymous',
                inline: true,
              },
              {
                name: 'Contact',
                value: suggestionContact.trim() || 'N/A',
                inline: true,
              },
              {
                name: 'Suggestion',
                value: message,
              },
            ],
            footer: {
              text: 'Spy App • Home Suggestions',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      setSuggestionOpen(false);
      resetSuggestionForm();
      Alert.alert('سوپاس', 'پێشنیارەکەت نێردرا');
    } catch (error) {
      Alert.alert('هەڵە', 'نەتوانرا پێشنیارەکە بنێردرێت');
    } finally {
      setSendingSuggestion(false);
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/spy-icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>سیخوڕ</Text>
          <Text style={styles.subtitle}>یاری کوردی</Text>
          
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getTotalWordCount()}</Text>
                <Text style={styles.statLabel}>وشە</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getTotalCategoryCount()}</Text>
                <Text style={styles.statLabel}>پۆل</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statLabel}>خۆشی</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          <GlassButton
            title="دەستپێکردنی یاری"
            icon={<Ionicons name="game-controller" size={22} color="#fff" />}
            onPress={() => navigation.navigate('PlayerSetup')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.menuButton}
          />
          
          <GlassButton
            title="چۆنیەتی یاریکردن"
            icon={<Ionicons name="book" size={22} color="#fff" />}
            onPress={() => navigation.navigate('HowToPlay')}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.menuButton}
          />
          
          <GlassButton
            title="ڕێکخستنەکان"
            icon={<Ionicons name="settings" size={22} color="#fff" />}
            onPress={() => navigation.navigate('Settings')}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.menuButton}
          />
          
          <GlassButton
            title="خاڵە باڵاکان"
            icon={<Ionicons name="trophy" size={22} color="#fff" />}
            onPress={() => navigation.navigate('HighScores')}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.menuButton}
          />

          <GlassButton
            title="پێشنیار"
            icon={<Ionicons name="chatbubble-ellipses" size={22} color="#fff" />}
            onPress={() => setSuggestionOpen(true)}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.menuButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Ionicons name="heart" size={16} color="#ff6b6b" style={{marginLeft: 8}} />
            <Text style={styles.footerText}>دروستکراوە بۆ کوردستان</Text>
          </View>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        visible={suggestionOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSuggestionOpen(false)}
      >
        <TouchableOpacity
          style={styles.suggestionOverlay}
          activeOpacity={1}
          onPress={() => setSuggestionOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => null}>
            <GlassCard style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionTitle}>پێشنیار</Text>
                <TouchableOpacity onPress={() => setSuggestionOpen(false)}>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <GlassInput
                value={suggestionName}
                onChangeText={setSuggestionName}
                placeholder="ناو (ئارەزووی)"
                autoCapitalize="words"
                style={styles.suggestionInput}
                textAlign="right"
              />
              <GlassInput
                value={suggestionContact}
                onChangeText={setSuggestionContact}
                placeholder="ژمارە یان ئیمەیڵ (ئارەزووی)"
                autoCapitalize="none"
                style={styles.suggestionInput}
                textAlign="right"
              />
              <GlassInput
                value={suggestionMessage}
                onChangeText={setSuggestionMessage}
                placeholder="پێشنیارەکەت بنووسە"
                autoCapitalize="sentences"
                style={[styles.suggestionInput, styles.suggestionMessage]}
                textAlign="right"
              />

              <View style={styles.suggestionActions}>
                <GlassButton
                  title={sendingSuggestion ? 'ناردن...' : 'ناردن'}
                  icon={<Ionicons name="send" size={18} color="#fff" />}
                  onPress={handleSendSuggestion}
                  variant="primary"
                  size="medium"
                  fullWidth
                  loading={sendingSuggestion}
                  disabled={sendingSuggestion}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    ...Typography.h1,
    fontSize: 42,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.h3,
    color: Colors.text.secondary,
    marginBottom: 12,
    fontSize: 16,
  },
  statsCard: {
    width: width - 60,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.glass.border,
  },
  menuContainer: {
    paddingHorizontal: 8,
  },
  menuButton: {
    marginVertical: 6,
  },
  suggestionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  suggestionCard: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  suggestionTitle: {
    ...Typography.h3,
  },
  suggestionInput: {
    marginBottom: 10,
  },
  suggestionMessage: {
    minHeight: 110,
  },
  suggestionActions: {
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  footerText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 4,
  },
});

export default HomeScreen;
