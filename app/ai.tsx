import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChatMessage,
  OPENROUTER_MODEL,
  clearOpenRouterApiKey,
  getOpenRouterApiKey,
  saveOpenRouterApiKey,
  sendOpenRouterResearchQuery,
} from '../lib/openrouter';

const PRESET_TOPICS = [
  '🌡️ Explain WBGT vs Temperature',
  '🏙️ Jurong microclimate risks',
  '💧 Hydration for heat stress',
  '📈 Urban heat island mitigation',
];

export default function AIScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your EcoWatch AI Research Assistant powered by ' +
        OPENROUTER_MODEL +
        '. Ask me any question about heat indices, weather research, or microclimate mitigation.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [isCustomKeySet, setIsCustomKeySet] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const hasHandledParam = useRef(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  useEffect(() => {
    if (params.query && !hasHandledParam.current) {
      hasHandledParam.current = true;
      handleSend(params.query);
    }
  }, [params.query]);

  async function checkKeyStatus() {
    const key = await getOpenRouterApiKey();
    setIsCustomKeySet(!!key);
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  }

  async function handleSaveKey() {
    const trimmed = customKeyInput.trim();
    if (!trimmed) {
      Alert.alert('Empty Key', 'Please enter a valid OpenRouter API key.');
      return;
    }
    await saveOpenRouterApiKey(trimmed);
    setIsCustomKeySet(true);
    setKeyModalVisible(false);
    setCustomKeyInput('');
    Alert.alert('Key Saved', 'OpenRouter API key configured successfully.');
  }

  async function handleClearKey() {
    await clearOpenRouterApiKey();
    setIsCustomKeySet(false);
    setKeyModalVisible(false);
    setCustomKeyInput('');
    Alert.alert('Key Cleared', 'Active key removed. Falling back to built-in knowledge base.');
  }

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const payload = newHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendOpenRouterResearchQuery(payload);

      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      Alert.alert('Research Error', err?.message || 'Failed to process inquiry.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>EcoWatch AI Research</Text>
            <Text style={styles.modelTag}>{OPENROUTER_MODEL}</Text>
          </View>

          <Pressable
            onPress={() => setKeyModalVisible(true)}
            style={styles.keyButton}
          >
            <Text style={styles.keyButtonText}>
              {isCustomKeySet ? 'Key: Active' : 'Set Key'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.presetScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetList}
          >
            {PRESET_TOPICS.map((topic) => (
              <Pressable
                key={topic}
                style={styles.presetChip}
                onPress={() => handleSend(topic)}
              >
                <Text style={styles.presetChipText}>{topic}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={true}
        >
          {messages.map((item) => {
            const isUser = item.role === 'user';
            return (
              <View
                key={item.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.userRow : styles.assistantRow,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading ? (
            <View style={[styles.messageRow, styles.assistantRow]}>
              <View style={[styles.bubble, styles.assistantBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#F07B2E" />
                <Text style={styles.loadingText}>Analyzing research telemetry...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            placeholder="Ask research question..."
            placeholderTextColor="#8A7A70"
            value={input}
            onChangeText={setInput}
            multiline
            style={styles.input}
          />
          <Pressable
            onPress={() => handleSend()}
            disabled={loading || !input.trim()}
            style={[
              styles.sendButton,
              (!input.trim() || loading) && styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>

        <Modal
          visible={keyModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setKeyModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>OpenRouter API Key</Text>
              <Text style={styles.modalSubtitle}>
                Enter your personal OpenRouter API key (starts with sk-or-v1-...). You can also set
                EXPO_PUBLIC_OPENROUTER_API_KEY in your .env file.
              </Text>

              <TextInput
                placeholder="sk-or-v1-..."
                placeholderTextColor="#A89F91"
                value={customKeyInput}
                onChangeText={setCustomKeyInput}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                style={styles.modalInput}
              />

              <View style={styles.modalButtonRow}>
                {isCustomKeySet && (
                  <Pressable
                    onPress={handleClearKey}
                    style={styles.modalClearButton}
                  >
                    <Text style={styles.modalClearText}>Remove Key</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => setKeyModalVisible(false)}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveKey}
                  style={styles.modalSaveButton}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBF1E4',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D4C3',
    backgroundColor: '#FBF1E4',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F07B2E',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2320',
  },
  modelTag: {
    fontSize: 11,
    color: '#706053',
    marginTop: 2,
  },
  keyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EBDCCE',
  },
  keyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2320',
  },
  presetScrollContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE2D4',
  },
  presetList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D4C3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  presetChipText: {
    fontSize: 12,
    color: '#2B2320',
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    width: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#F07B2E',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D4C3',
    borderBottomLeftRadius: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#706053',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#2B2320',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2D4C3',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#F8F3EC',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: '#2B2320',
  },
  sendButton: {
    backgroundColor: '#F07B2E',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2320',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#706053',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2D4C3',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#2B2320',
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  modalClearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FCE8E6',
    marginRight: 'auto',
  },
  modalClearText: {
    color: '#D9381E',
    fontWeight: '600',
    fontSize: 13,
  },
  modalCancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EBDCCE',
  },
  modalCancelText: {
    color: '#2B2320',
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F07B2E',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
