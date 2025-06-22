import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, SegmentedButtons, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../../src/constants/colors';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/authStore';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [role, setRole] = React.useState('student');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { signUp, isLoading, user } = useAuthStore();

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

  const handleSignUp = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('signup.fillAllFields') || 'Please fill in all fields'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t('common.error') || 'Error',
        t('signup.passwordsDoNotMatch') || 'Passwords do not match'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t('common.error') || 'Error',
        t('signup.passwordTooShort') || 'Password must be at least 6 characters'
      );
      return;
    }

    const result = await signUp({
      email: email.trim(),
      password,
      name: name.trim(),
      role: role as 'student' | 'coach',
    });

    if (!result.success) {
      Alert.alert(
        t('common.error') || 'Error',
        result.error || 'Registration failed'
      );
      return;
    }

    // Navigation will be handled by the useEffect above
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary.main, colors.primary.light]}
          style={styles.header}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.text.white}
            style={styles.backButton}
            onPress={() => router.back()}
          />
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text variant="headlineLarge" style={styles.logoText}>
                🎓
              </Text>
            </View>
            <Text variant="headlineMedium" style={styles.appName}>
              {t('signup.title')}
            </Text>
            <Text variant="bodyLarge" style={styles.tagline}>
              {t('signup.subtitle')}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text variant="headlineSmall" style={styles.title}>
              {t('signup.createAccount')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('signup.description')}
            </Text>

            <View style={styles.form}>
              <View style={styles.roleSection}>
                <Text variant="bodyMedium" style={styles.roleLabel}>
                  {t('signup.role')}
                </Text>
                <SegmentedButtons
                  value={role}
                  onValueChange={setRole}
                  buttons={[
                    { 
                      value: 'student', 
                      label: t('signup.student'),
                      style: role === 'student' ? styles.selectedSegment : {}
                    },
                    { 
                      value: 'coach', 
                      label: t('signup.coach'),
                      style: role === 'coach' ? styles.selectedSegment : {}
                    },
                  ]}
                  style={styles.segmentedButtons}
                />
              </View>

              <TextInput
                label={t('signup.fullName')}
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account-outline" />}
                outlineStyle={styles.inputOutline}
              />
              
              <TextInput
                label={t('signup.email')}
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
                label={t('signup.password')}
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
              
              <TextInput
                label={t('signup.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                outlineStyle={styles.inputOutline}
              />

              <Button
                mode="contained"
                onPress={handleSignUp}
                style={styles.signupButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                {t('signup.createAccountBtn')}
              </Button>

              <Text variant="bodySmall" style={styles.terms}>
                {t('signup.terms')}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              {t('signup.haveAccount')}{' '}
            </Text>
            <Button
              mode="text"
              onPress={() => router.push('/auth/login')}
              compact
              labelStyle={styles.loginLink}
            >
              {t('signup.signIn')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 35,
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
    paddingBottom: 32,
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
    marginBottom: 24,
    color: colors.text.secondary,
  },
  form: {
    gap: 16,
  },
  roleSection: {
    marginBottom: 8,
  },
  roleLabel: {
    marginBottom: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  selectedSegment: {
    backgroundColor: colors.primary.main,
  },
  input: {
    backgroundColor: colors.surface.light,
  },
  inputOutline: {
    borderColor: colors.surface.border,
    borderWidth: 1,
  },
  signupButton: {
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
  terms: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: 16,
    lineHeight: 20,
  },
  link: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.text.secondary,
  },
  loginLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});