import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../../src/constants/colors';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const { t } = useTranslation();
  const { signIn, isLoading, user } = useAuthStore();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        router.replace('/student/(tabs)/dashboard');
      } else {
        router.replace('/coach/(tabs)/dashboard');
      }
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        t('common.error') || 'Error', 
        t('login.fillAllFields') || 'Please fill in all fields'
      );
      return;
    }

    const result = await signIn({ email: email.trim(), password });
    
    if (!result.success) {
      Alert.alert(
        t('common.error') || 'Error',
        result.error || 'Login failed'
      );
      return;
    }

    // Navigation will be handled by the useEffect above
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.light]}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text variant="headlineLarge" style={styles.logoText}>
              📚
            </Text>
          </View>
          <Text variant="headlineMedium" style={styles.appName}>
            StudyTracker
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            {t('login.subtitle')}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.formCard}>
          <Text variant="headlineSmall" style={styles.title}>
            {t('login.title')}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {t('login.subtitle')}
          </Text>

          <View style={styles.form}>
            <TextInput
              label={t('login.email')}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" />}
              outlineStyle={styles.inputOutline}
            />
            <TextInput
              label={t('login.password')}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              outlineStyle={styles.inputOutline}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              loading={isLoading}
              disabled={isLoading}
            >
              {t('login.signIn')}
            </Button>

            <Button
              mode="text"
              onPress={() => {}}
              style={styles.forgotButton}
              labelStyle={styles.forgotButtonLabel}
            >
              {t('login.forgotPassword')}
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={styles.footerText}>
            {t('login.noAccount')}{' '}
          </Text>
          <Button
            mode="text"
            onPress={() => router.push('/auth/signup')}
            compact
            labelStyle={styles.signupLink}
          >
            {t('login.signUp')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    color: colors.text.white,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -40,
  },
  formCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    padding: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: colors.text.secondary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.surface.light,
  },
  inputOutline: {
    borderColor: colors.surface.border,
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'center',
  },
  forgotButtonLabel: {
    color: colors.primary.main,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: colors.text.secondary,
  },
  signupLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});