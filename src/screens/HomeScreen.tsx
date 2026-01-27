import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { GradientBackground, GlassButton, GlassCard } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import { getTotalWordCount } from '../data/words';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <GradientBackground>
      <View style={styles.container}>
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
                <Text style={styles.statNumber}>20</Text>
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Ionicons name="heart" size={16} color="#ff6b6b" style={{marginLeft: 8}} />
            <Text style={styles.footerText}>دروستکراوە بۆ کوردستان</Text>
          </View>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
