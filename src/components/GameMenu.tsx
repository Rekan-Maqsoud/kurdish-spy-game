import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';

interface AddPlayerResult {
  success: boolean;
  message?: string;
}

interface GameMenuProps {
  onGoHome: () => void;
  onChangeWord: () => void;
  onAddPlayer: (name: string) => AddPlayerResult;
  showChangeWord?: boolean;
  showAddPlayer?: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({
  onGoHome,
  onChangeWord,
  onAddPlayer,
  showChangeWord = true,
  showAddPlayer = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const closeMenu = () => {
    setIsOpen(false);
    setShowAddForm(false);
  };

  const handleAddPlayer = () => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      Alert.alert('ئاگاداری', 'تکایە ناوی یاریزان بنووسە');
      return;
    }

    const result = onAddPlayer(trimmed);
    if (!result.success) {
      Alert.alert('ئاگاداری', result.message || 'نەتوانرا یاریزان زیاد بکرێ');
      return;
    }

    setPlayerName('');
    closeMenu();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeMenu}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => null}>
              <GlassCard style={styles.menuCard}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>مێنیو</Text>
                  <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                <GlassButton
                  title="گەڕانەوە بۆ ماڵ"
                  icon={<Ionicons name="home" size={20} color="#fff" />}
                  onPress={() => {
                    closeMenu();
                    setTimeout(() => {
                      onGoHome();
                    }, 0);
                  }}
                  variant="ghost"
                  size="medium"
                  fullWidth
                  style={styles.menuAction}
                />

                {showChangeWord && (
                  <GlassButton
                    title="گۆڕینی وشە"
                    icon={<Ionicons name="shuffle" size={20} color="#fff" />}
                    onPress={() => {
                      closeMenu();
                      onChangeWord();
                    }}
                    variant="ghost"
                    size="medium"
                    fullWidth
                    style={styles.menuAction}
                  />
                )}

                {showAddPlayer && (
                  <>
                    {!showAddForm ? (
                      <GlassButton
                        title="یاریزانی نوێ زیاد بکە"
                        icon={<Ionicons name="person-add" size={20} color="#fff" />}
                        onPress={() => setShowAddForm(true)}
                        variant="ghost"
                        size="medium"
                        fullWidth
                        style={styles.menuAction}
                      />
                    ) : (
                      <View style={styles.addForm}>
                        <Text style={styles.addLabel}>ناوی یاریزانی نوێ</Text>
                        <GlassInput
                          value={playerName}
                          onChangeText={setPlayerName}
                          placeholder="ناو"
                          autoCapitalize="words"
                          style={styles.addInput}
                        />
                        <View style={styles.addActions}>
                          <GlassButton
                            title="زیاد بکە"
                            icon={<Ionicons name="checkmark" size={20} color="#fff" />}
                            onPress={handleAddPlayer}
                            variant="primary"
                            size="medium"
                            style={styles.addButton}
                          />
                          <TouchableOpacity onPress={() => setShowAddForm(false)}>
                            <Text style={styles.cancelText}>هەڵوەشاندنەوە</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </GlassCard>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
  },
  menuCard: {
    padding: 16,
    backgroundColor: 'rgba(20, 20, 32, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  menuHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    ...Typography.h3,
    textAlign: 'right',
  },
  closeButton: {
    padding: 6,
  },
  menuAction: {
    marginVertical: 6,
  },
  addForm: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.glass.border,
    paddingTop: 12,
  },
  addLabel: {
    ...Typography.label,
    textAlign: 'right',
    marginBottom: 8,
    color: Colors.text.muted,
  },
  addInput: {
    marginBottom: 10,
  },
  addActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
  },
  cancelText: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginRight: 12,
  },
});

export default GameMenu;
