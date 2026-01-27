import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { GradientBackground, GlassCard } from '../components';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

const HowToPlayScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  };

  const steps = [
    {
      number: '١',
      title: 'یاریزانەکان دیاری بکە',
      description: 'لانیکەم ٣ یاریزان پێویستە. هەر یاریزانێک ناوی خۆی بنووسێت.',
      iconName: 'people',
      iconType: 'Ionicons',
    },
    {
      number: '٢',
      title: 'وشەکان دابەش بکە',
      description: 'هەر یاریزانێک مۆبایلەکە دەگرێت و وشەکەی خۆی دەبینێت. یەکێک لەوان سیخوڕە و وشەکە نازانێت!',
      iconName: 'phone-portrait',
      iconType: 'Ionicons',
    },
    {
      number: '٣',
      title: 'گفتوگۆ دەست پێدەکات',
      description: 'یاریزانەکان پرسیار دەکەن و وەڵام دەدەنەوە بەبێ گوتنی وشەکە. سیخوڕ دەبێ خۆی بشارێتەوە!',
      iconName: 'chatbubbles',
      iconType: 'Ionicons',
    },
    {
      number: '٤',
      title: 'دەنگدان',
      description: 'دوای گفتوگۆ، هەموو دەنگ دەدەن بۆ ئەوەی کێ سیخوڕە.',
      iconName: 'vote',
      iconType: 'MaterialCommunityIcons',
    },
    {
      number: '٥',
      title: 'تەخمینی سیخوڕ',
      description: 'ئەگەر سیخوڕ دۆزرایەوە، دەتوانێت وشەکە تەخمین بکات بۆ بەدەستهێنانی خاڵ.',
      iconName: 'target',
      iconType: 'MaterialCommunityIcons',
    },
    {
      number: '٦',
      title: 'خاڵەکان',
      description: 'ئەوانەی سیخوڕیان دۆزیەوە ١ خاڵ دەبەن. ئەگەر سیخوڕ وشەکەی دۆزیەوە ٢ خاڵ دەبات.',
      iconName: 'star',
      iconType: 'Ionicons',
    },
  ];

  const tips = [
    'سیخوڕ: گوێ بگرە بۆ وەڵامەکانی تر و هەوڵبدە وشەکە بدۆزیتەوە',
    'یاریزان: پرسیارێ بکە کە سیخوڕ بتوانێ بزانێت بەڵام وشەکەش نەڵێت',
    'یاریزان: گوێ بگرە بۆ وەڵامە نادیارەکان',
    'سیخوڕ: زۆر نەپرسە چونکە گومان لێت دەکرێت',
  ];

  const renderStepIcon = (iconName: string, iconType: string) => {
    const iconSize = 28;
    const iconColor = '#fff';
    
    switch (iconType) {
      case 'Ionicons':
        return <Ionicons name={iconName as any} size={iconSize} color={iconColor} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName as any} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name="help-circle" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>چۆنیەتی یاریکردن</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Steps */}
          <Text style={styles.sectionTitle}>هەنگاوەکان</Text>
          {steps.map((step, index) => (
            <GlassCard key={index} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepIcon}>
                  {renderStepIcon(step.iconName, step.iconType)}
                </View>
                <View style={styles.stepTitleContainer}>
                  <Text style={styles.stepNumber}>هەنگاوی {step.number}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </GlassCard>
          ))}

          {/* Tips */}
          <Text style={styles.sectionTitle}>ئامۆژگارییەکان</Text>
          <GlassCard style={styles.tipsCard}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color="#ffd700" style={{marginLeft: 8}} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Points Explanation */}
          <Text style={styles.sectionTitle}>سیستەمی خاڵەکان</Text>
          <GlassCard style={styles.pointsCard}>
            <View style={styles.pointItem}>
              <View style={[styles.pointBadge, { backgroundColor: Colors.player.primary }]}>
                <Text style={styles.pointValue}>+1</Text>
              </View>
              <Text style={styles.pointDescription}>بۆ دۆزینەوەی سیخوڕ</Text>
            </View>
            <View style={styles.pointDivider} />
            <View style={styles.pointItem}>
              <View style={[styles.pointBadge, { backgroundColor: Colors.spy.primary }]}>
                <Text style={styles.pointValue}>+2</Text>
              </View>
              <Text style={styles.pointDescription}>بۆ سیخوڕ ئەگەر وشەکەی دۆزیەوە</Text>
            </View>
          </GlassCard>
        </ScrollView>
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
    paddingBottom: 30,
  },
  sectionTitle: {
    ...Typography.h3,
    textAlign: 'right',
    marginBottom: 16,
    marginTop: 10,
    color: Colors.accent.gold,
  },
  stepCard: {
    marginBottom: 12,
  },
  stepHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIcon: {
    fontSize: 32,
    marginLeft: 12,
  },
  stepTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stepNumber: {
    ...Typography.caption,
    color: Colors.primary.start,
    marginBottom: 2,
  },
  stepTitle: {
    ...Typography.h4,
  },
  stepDescription: {
    ...Typography.body,
    textAlign: 'right',
    lineHeight: 26,
    writingDirection: 'rtl',
  },
  tipsCard: {
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  tipBullet: {
    fontSize: 18,
    marginLeft: 10,
  },
  tipText: {
    ...Typography.body,
    flex: 1,
    textAlign: 'right',
    lineHeight: 24,
    writingDirection: 'rtl',
  },
  pointsCard: {
    marginBottom: 20,
  },
  pointItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pointBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  pointValue: {
    ...Typography.h4,
    color: '#fff',
  },
  pointDescription: {
    ...Typography.body,
    flex: 1,
    textAlign: 'right',
  },
  pointDivider: {
    height: 1,
    backgroundColor: Colors.glass.border,
    marginVertical: 10,
  },
});

export default HowToPlayScreen;
