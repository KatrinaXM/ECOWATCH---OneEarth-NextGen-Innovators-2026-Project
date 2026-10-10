import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/auth';

export default function LoginScreen() {
  const { signIn, signUp, signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Required Fields', 'Please enter both student email and password.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(trimmedEmail, password);

        if (error) {
          Alert.alert('Sign Up Notice', error.message);
          return;
        }

        if (data?.session) {
          router.replace('/(tabs)/home');
        } else {
          Alert.alert(
            'Verification Email Sent',
            'Registration successful! Please check your email to confirm your account, or continue in Guest mode for quick testing.'
          );
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(trimmedEmail, password);

        if (error) {
          Alert.alert('Login Notice', error.message);
          return;
        }

        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert('Auth Error', err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  function handleGuestLogin() {
    signInAsGuest();
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.container2}>
            <Image
              source={require('../logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to EcoWatch</Text>
          </View>

          <Image
            source={require('../border2.png')}
            style={styles.border}
            resizeMode="contain"
          />

          <Text style={styles.loginmessage}>
            {isSignUp ? 'Create Student Account' : 'Student Login'}
          </Text>

          <Text style={styles.emaillabel}>Email</Text>
          <TextInput
            placeholder="Enter your student email"
            placeholderTextColor="#9C8E80"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.email}
          />

          <View style={styles.passwordHeaderRow}>
            <Text style={styles.passwordlabel}>Password</Text>
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.togglePasswordText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9C8E80"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={styles.password}
          />

          <Pressable
            onPress={handleAuth}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.ButtonText}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Log in'
                : "Don't have an account? Sign up"}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleGuestLogin}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>Continue as Guest (Demo Mode)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBF1E4',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  container: {
    alignItems: 'flex-start',
    marginTop: 8,
    backgroundColor: '#FBF1E4',
    width: '100%',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  logo: {
    width: 48,
    height: 64,
    marginBottom: 4,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#2B2320',
  },
  border: {
    alignSelf: 'center',
    width: '90%',
    aspectRatio: 345 / 24,
    marginTop: 16,
  },
  loginmessage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2B2320',
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: 28,
    marginBottom: 8,
  },
  emaillabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2320',
    marginTop: 16,
    marginBottom: 6,
  },
  email: {
    alignSelf: 'stretch',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2D4C3',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#2B2320',
  },
  passwordHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 6,
  },
  passwordlabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2320',
  },
  togglePasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F07B2E',
  },
  password: {
    alignSelf: 'stretch',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2D4C3',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#2B2320',
  },
  button: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F07B2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  ButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 6,
  },
  switchText: {
    color: '#8A5D3B',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2D4C3',
  },
  dividerText: {
    color: '#9C8E80',
    fontSize: 13,
    fontWeight: '500',
  },
  guestButton: {
    alignSelf: 'stretch',
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4C3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    color: '#4B3F35',
    fontSize: 14,
    fontWeight: '600',
  },
});
