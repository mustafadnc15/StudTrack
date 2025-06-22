import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Avatar, Button, List, IconButton, Chip, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../../../src/constants/colors';
import { useTranslation, useLanguageStore } from '../../../src/hooks/useTranslation';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const [languageMenuVisible, setLanguageMenuVisible] = React.useState(false);

  const handleLogout = () => {
    // TODO: Implement proper logout
    router.replace('/auth/login');
  };

  const stats = [
    { label: t('profile.studyHours'), value: '127h', icon: '📚' },
    { label: t('profile.currentStreak'), value: `7 ${t('common.days')}`, icon: '🔥' },
    { label: t('profile.totalSessions'), value: '42', icon: '⏱️' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.light]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Menu
              visible={languageMenuVisible}
              onDismiss={() => setLanguageMenuVisible(false)}
              anchor={
                <IconButton
                  icon="translate"
                  size={24}
                  iconColor={colors.text.white}
                  style={styles.languageButton}
                  onPress={() => setLanguageMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setLanguage('en');
                  setLanguageMenuVisible(false);
                }}
                title="English"
                leadingIcon={language === 'en' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setLanguage('tr');
                  setLanguageMenuVisible(false);
                }}
                title="Türkçe"
                leadingIcon={language === 'tr' ? 'check' : undefined}
              />
            </Menu>
            <IconButton
              icon="cog"
              size={24}
              iconColor={colors.text.white}
              style={styles.settingsButton}
              onPress={() => {}}
            />
          </View>
          
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar.Text 
                label="AJ" 
                size={100} 
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <IconButton
                icon="camera"
                size={20}
                iconColor={colors.text.white}
                style={styles.cameraButton}
                onPress={() => {}}
              />
            </View>
            
            <Text variant="headlineMedium" style={styles.name}>
              Alex Johnson
            </Text>
            <Text variant="bodyLarge" style={styles.email}>
              alex.johnson@example.com
            </Text>
            
            <View style={styles.roleBadge}>
              <Text variant="bodyMedium" style={styles.roleText}>
                {t('profile.student')}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {/* Stats Card */}
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <Text variant="titleMedium" style={styles.statsTitle}>
                {t('profile.yourProgress')}
              </Text>
              
              <View style={styles.statsRow}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text variant="titleMedium" style={styles.statValue}>
                      {stat.value}
                    </Text>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card style={styles.quickActionsCard}>
            <Card.Content style={styles.quickActionsContent}>
              <Text variant="titleMedium" style={styles.quickActionsTitle}>
                {t('profile.quickActions')}
              </Text>
              
              <View style={styles.quickActionsList}>
                <Button
                  mode="contained-tonal"
                  onPress={() => {}}
                  style={styles.quickActionButton}
                  contentStyle={styles.quickActionContent}
                  icon="target"
                >
                  {t('profile.setGoal')}
                </Button>
                <Button
                  mode="contained-tonal"
                  onPress={() => {}}
                  style={styles.quickActionButton}
                  contentStyle={styles.quickActionContent}
                  icon="export"
                >
                  {t('profile.exportData')}
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Menu Card */}
          <Card style={styles.menuCard}>
            <Card.Content style={styles.menuContent}>
              <List.Item
                title={t('profile.accountSettings')}
                description={t('profile.accountSettingsDesc')}
                left={(props) => (
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuEmoji}>⚙️</Text>
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
              
              <List.Item
                title={t('profile.notifications')}
                description={t('profile.notificationsDesc')}
                left={(props) => (
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuEmoji}>🔔</Text>
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
              
              <List.Item
                title={t('profile.privacySecurity')}
                description={t('profile.privacySecurityDesc')}
                left={(props) => (
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuEmoji}>🛡️</Text>
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
              
              <List.Item
                title={t('profile.helpSupport')}
                description={t('profile.helpSupportDesc')}
                left={(props) => (
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuEmoji}>💬</Text>
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
              
              <List.Item
                title={t('profile.aboutApp')}
                description={t('profile.aboutAppDesc')}
                left={(props) => (
                  <View style={styles.menuIconContainer}>
                    <Text style={styles.menuEmoji}>ℹ️</Text>
                  </View>
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
                style={styles.menuItem}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
            </Card.Content>
          </Card>

          {/* Logout Button */}
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            labelStyle={styles.logoutButtonLabel}
            icon="logout"
          >
            {t('profile.signOut')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    marginBottom: 20,
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarLabel: {
    color: colors.text.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.primary.dark,
    width: 36,
    height: 36,
  },
  name: {
    color: colors.text.white,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  roleText: {
    color: colors.text.white,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsCard: {
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  statsContent: {
    padding: 20,
  },
  statsTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    color: colors.primary.main,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  quickActionsCard: {
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  quickActionsContent: {
    padding: 20,
  },
  quickActionsTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsList: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
  },
  quickActionContent: {
    paddingVertical: 8,
  },
  menuCard: {
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
  },
  menuContent: {
    padding: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuEmoji: {
    fontSize: 20,
  },
  menuTitle: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  menuDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    borderColor: colors.error,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  logoutButtonContent: {
    paddingVertical: 12,
  },
  logoutButtonLabel: {
    color: colors.error,
    fontWeight: '600',
  },
});