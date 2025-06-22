import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '../../../src/constants/colors';
import { useTranslation } from '../../../src/hooks/useTranslation';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { t } = useTranslation();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? t('dashboard.greeting.morning') : currentHour < 18 ? t('dashboard.greeting.afternoon') : t('dashboard.greeting.evening');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.light]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.greetingSection}>
              <Text variant="bodyLarge" style={styles.greeting}>
                {greeting}
              </Text>
              <Text variant="headlineSmall" style={styles.userName}>
                Alex Johnson
              </Text>
            </View>
            <Avatar.Text label="AJ" size={50} style={styles.avatar} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.streakCard}
          >
            <View style={styles.streakContent}>
              <View style={styles.streakIcon}>
                <Text style={styles.streakEmoji}>🔥</Text>
              </View>
              <View style={styles.streakInfo}>
                <Text variant="displaySmall" style={styles.streakNumber}>
                  7
                </Text>
                <Text variant="bodyLarge" style={styles.streakText}>
                  {t('dashboard.dayStreak')}
                </Text>
                <Text variant="bodyMedium" style={styles.streakSubtext}>
                  {t('dashboard.keepItGoing')}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <Card style={styles.progressCard}>
            <Card.Content style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text variant="titleLarge" style={styles.progressTitle}>
                  {t('dashboard.todaysProgress')}
                </Text>
                <View style={styles.progressBadge}>
                  <Text variant="bodySmall" style={styles.progressBadgeText}>
                    83%
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressStats}>
                <Text variant="headlineSmall" style={styles.progressTime}>
                  2h 30m
                </Text>
                <Text variant="bodyMedium" style={styles.progressGoal}>
                  {t('dashboard.ofGoal', { goal: '3h' })}
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[colors.primary.main, colors.primary.light]}
                    style={[styles.progressFill, { width: '83%' }]}
                  />
                </View>
              </View>
              
              <Text variant="bodySmall" style={styles.progressEncouragement}>
                {t('dashboard.goalEncouragement', { time: '30 minutes' })}
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.quickStatsRow}>
            <Card style={styles.quickStatCard}>
              <Card.Content style={styles.quickStatContent}>
                <Text variant="bodySmall" style={styles.quickStatLabel}>
                  {t('analytics.thisWeek')}
                </Text>
                <Text variant="titleLarge" style={styles.quickStatValue}>
                  18h
                </Text>
                <Text variant="bodySmall" style={styles.quickStatChange}>
                  {t('analytics.changeFromLastWeek', { change: '+2h' })}
                </Text>
              </Card.Content>
            </Card>
            
            <Card style={styles.quickStatCard}>
              <Card.Content style={styles.quickStatContent}>
                <Text variant="bodySmall" style={styles.quickStatLabel}>
                  {t('analytics.avgSession')}
                </Text>
                <Text variant="titleLarge" style={styles.quickStatValue}>
                  45m
                </Text>
                <Text variant="bodySmall" style={styles.quickStatChange}>
                  {t('analytics.optimalFocusTime')}
                </Text>
              </Card.Content>
            </Card>
          </View>

          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionHeader}>
                <Text variant="titleLarge" style={styles.actionTitle}>
                  {t('dashboard.readyToStudy')}
                </Text>
                <Text variant="bodyMedium" style={styles.actionSubtitle}>
                  {t('dashboard.startSessionDescription')}
                </Text>
              </View>
              
              <Button
                mode="contained"
                onPress={() => router.push('/student/(tabs)/study')}
                style={styles.startButton}
                contentStyle={styles.startButtonContent}
                labelStyle={styles.startButtonLabel}
                icon="play"
              >
                {t('common.startStudySession')}
              </Button>
              
              <View style={styles.quickActions}>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  style={styles.quickAction}
                  compact
                  icon="book-outline"
                >
                  {t('common.quickLog')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  style={styles.quickAction}
                  compact
                  icon="target"
                >
                  {t('common.setGoal')}
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.recentCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.recentTitle}>
                {t('dashboard.recentSessions')}
              </Text>
              
              <View style={styles.recentSession}>
                <View style={styles.recentSessionIcon}>
                  <Text>📐</Text>
                </View>
                <View style={styles.recentSessionInfo}>
                  <Text variant="bodyMedium" style={styles.recentSessionSubject}>
                    Mathematics
                  </Text>
                  <Text variant="bodySmall" style={styles.recentSessionTime}>
                    {t('common.yesterday')} • 1h 15m
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.recentSessionScore}>
                  {t('dashboard.greatFocus')}
                </Text>
              </View>
              
              <View style={styles.recentSession}>
                <View style={styles.recentSessionIcon}>
                  <Text>⚛️</Text>
                </View>
                <View style={styles.recentSessionInfo}>
                  <Text variant="bodyMedium" style={styles.recentSessionSubject}>
                    Physics
                  </Text>
                  <Text variant="bodySmall" style={styles.recentSessionTime}>
                    {t('common.yesterday')} • 45m
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.recentSessionScore}>
                  {t('dashboard.goodWork')}
                </Text>
              </View>
            </Card.Content>
          </Card>
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
    paddingBottom: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    color: colors.text.white,
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  streakCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  streakIcon: {
    marginRight: 20,
  },
  streakEmoji: {
    fontSize: 40,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    color: colors.text.white,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  streakText: {
    color: colors.text.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  progressContent: {
    padding: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  progressStats: {
    marginBottom: 16,
  },
  progressTime: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressGoal: {
    color: colors.text.secondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressEncouragement: {
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 1,
  },
  quickStatContent: {
    padding: 16,
    alignItems: 'center',
  },
  quickStatLabel: {
    color: colors.text.secondary,
    marginBottom: 8,
  },
  quickStatValue: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatChange: {
    color: colors.success,
    fontSize: 11,
  },
  actionCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  actionContent: {
    padding: 24,
  },
  actionHeader: {
    marginBottom: 20,
  },
  actionTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionSubtitle: {
    color: colors.text.secondary,
  },
  startButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 16,
    marginBottom: 16,
  },
  startButtonContent: {
    paddingVertical: 12,
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    borderRadius: 12,
    borderColor: colors.surface.border,
  },
  recentCard: {
    borderRadius: 20,
    elevation: 1,
  },
  recentTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  recentSession: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentSessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentSessionInfo: {
    flex: 1,
  },
  recentSessionSubject: {
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  recentSessionTime: {
    color: colors.text.secondary,
  },
  recentSessionScore: {
    color: colors.success,
    fontWeight: '500',
  },
});