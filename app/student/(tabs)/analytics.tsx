import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, ProgressBar, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../src/constants/colors';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const weekProgress = 0.72; // 72% of weekly goal
  const subjectData = [
    { name: 'Mathematics', time: '8h 30m', percentage: 0.47, color: '#FF6B6B', emoji: '📐' },
    { name: 'Physics', time: '6h 15m', percentage: 0.35, color: '#4ECDC4', emoji: '⚛️' },
    { name: 'Chemistry', time: '3h 45m', percentage: 0.18, color: '#45B7D1', emoji: '🧪' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.light]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Analytics
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Track your learning progress
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {/* Weekly Overview */}
          <Card style={styles.weeklyCard}>
            <Card.Content style={styles.weeklyContent}>
              <View style={styles.weeklyHeader}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  This Week
                </Text>
                <View style={styles.weeklyBadge}>
                  <Text variant="bodySmall" style={styles.badgeText}>
                    {Math.round(weekProgress * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.weeklyStats}>
                <View style={styles.statItem}>
                  <Text variant="displayMedium" style={styles.statNumber}>
                    18h
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Total Study Time
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="displayMedium" style={styles.statNumber}>
                    6
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Study Sessions
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text variant="bodyMedium" style={styles.progressLabel}>
                    Weekly Goal Progress
                  </Text>
                  <Text variant="bodySmall" style={styles.progressText}>
                    18h / 25h
                  </Text>
                </View>
                <ProgressBar
                  progress={weekProgress}
                  color={colors.primary.main}
                  style={styles.progressBar}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Subject Breakdown */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Subject Breakdown
              </Text>

              {subjectData.map((subject, index) => (
                <View key={index} style={styles.subjectItem}>
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
                      <View style={styles.subjectDetails}>
                        <Text variant="bodyLarge" style={styles.subjectName}>
                          {subject.name}
                        </Text>
                        <Text variant="bodyMedium" style={styles.subjectTime}>
                          {subject.time}
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodyMedium" style={styles.subjectPercentage}>
                      {Math.round(subject.percentage * 100)}%
                    </Text>
                  </View>
                  <View style={styles.subjectBarContainer}>
                    <View style={styles.subjectBar}>
                      <View
                        style={[
                          styles.subjectBarFill,
                          {
                            width: `${subject.percentage * 100}%`,
                            backgroundColor: subject.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Performance Insights */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Performance Insights
              </Text>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Text style={styles.insightEmoji}>⏰</Text>
                </View>
                <View style={styles.insightContent}>
                  <Text variant="bodyLarge" style={styles.insightTitle}>
                    Best Study Time
                  </Text>
                  <Text variant="bodyMedium" style={styles.insightDescription}>
                    You&apos;re most productive between 9 AM - 11 AM
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Text style={styles.insightEmoji}>📈</Text>
                </View>
                <View style={styles.insightContent}>
                  <Text variant="bodyLarge" style={styles.insightTitle}>
                    Study Trend
                  </Text>
                  <Text variant="bodyMedium" style={styles.insightDescription}>
                    +15% improvement from last week
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={styles.insightIcon}>
                  <Text style={styles.insightEmoji}>🎯</Text>
                </View>
                <View style={styles.insightContent}>
                  <Text variant="bodyLarge" style={styles.insightTitle}>
                    Focus Score
                  </Text>
                  <Text variant="bodyMedium" style={styles.insightDescription}>
                    Average session: 45 minutes (Excellent!)
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Achievements */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Recent Achievements
              </Text>

              <View style={styles.achievementsList}>
                <Chip
                  icon="fire"
                  style={[styles.achievementChip, { backgroundColor: '#FFE5E5' }]}
                  textStyle={{ color: '#FF6B6B' }}
                >
                  7 Day Streak
                </Chip>
                <Chip
                  icon="star"
                  style={[styles.achievementChip, { backgroundColor: '#FFF4E5' }]}
                  textStyle={{ color: '#F59E0B' }}
                >
                  20 Hours This Week
                </Chip>
                <Chip
                  icon="book-open"
                  style={[styles.achievementChip, { backgroundColor: '#E5F7FF' }]}
                  textStyle={{ color: '#45B7D1' }}
                >
                  Study Warrior
                </Chip>
                <Chip
                  icon="trophy"
                  style={[styles.achievementChip, { backgroundColor: '#E8F5E8' }]}
                  textStyle={{ color: '#10B981' }}
                >
                  Goal Crusher
                </Chip>
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
    alignItems: 'center',
  },
  title: {
    color: colors.text.white,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weeklyCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weeklyContent: {
    padding: 24,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.surface.border,
    marginHorizontal: 20,
  },
  statNumber: {
    color: colors.primary.main,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  progressText: {
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface.light,
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  subjectTime: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  subjectPercentage: {
    color: colors.text.secondary,
    fontWeight: '500',
  },
  subjectBarContainer: {
    marginTop: 4,
  },
  subjectBar: {
    height: 6,
    backgroundColor: colors.surface.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  insightDescription: {
    color: colors.text.secondary,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementChip: {
    marginBottom: 8,
  },
});