import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, StyleProp, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

interface PlayerCardProps {
  name: string;
  score: number;
  index: number;
  isCurrentPlayer?: boolean;
  isSpy?: boolean;
  revealed?: boolean;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  showScore?: boolean;
  disabled?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  score,
  index,
  isCurrentPlayer = false,
  isSpy = false,
  revealed = false,
  selected = false,
  onPress,
  style,
  showScore = true,
  disabled = false,
}) => {
  const getBackgroundColor = () => {
    if (revealed && isSpy) return 'rgba(255, 107, 107, 0.3)';
    if (selected) return 'rgba(102, 126, 234, 0.4)';
    if (isCurrentPlayer) return 'rgba(78, 205, 196, 0.3)';
    return Colors.glass.background;
  };

  const getBorderColor = () => {
    if (revealed && isSpy) return Colors.spy.primary;
    if (selected) return Colors.primary.start;
    if (isCurrentPlayer) return Colors.player.primary;
    return Colors.glass.border;
  };

  const CardContent = () => (
    <>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.content,
          { backgroundColor: getBackgroundColor() },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: revealed && isSpy ? Colors.spy.primary : Colors.primary.start },
            ]}
          >
            {revealed && isSpy ? (
              <Image source={require('../../assets/spy-icon.png')} style={{width: 20, height: 20}} resizeMode="contain" />
            ) : (
              <Text style={styles.avatarText}>{(index + 1).toString()}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.name, revealed && isSpy && styles.spyName]}>
            {name}
          </Text>
          {revealed && isSpy && (
            <Text style={styles.spyLabel}>سیخوڕ!</Text>
          )}
        </View>
        
        {showScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>خاڵ</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
        )}
        
        {selected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </View>
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          { borderColor: getBorderColor() },
          style,
        ]}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { borderColor: getBorderColor() },
        disabled && styles.disabled,
        style,
      ]}
    >
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    marginVertical: 6,
  },
  content: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    ...Typography.h4,
    color: Colors.text.primary,
    textAlign: 'right',
  },
  spyName: {
    color: Colors.spy.primary,
  },
  spyLabel: {
    ...Typography.bodySmall,
    color: Colors.spy.primary,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
  score: {
    ...Typography.h4,
    color: Colors.accent.gold,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary.start,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PlayerCard;
