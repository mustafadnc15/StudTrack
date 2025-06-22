import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text, Button, Card, TextInput, IconButton, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../src/constants/colors';

const { width } = Dimensions.get('window');

export default function StudyScreen() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [subject, setSubject] = React.useState('');
  const [selectedPreset, setSelectedPreset] = React.useState<number | null>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const presetSubjects = [
    { name: 'Mathematics', emoji: '📐', color: '#FF6B6B' },
    { name: 'Physics', emoji: '⚛️', color: '#4ECDC4' },
    { name: 'Chemistry', emoji: '🧪', color: '#45B7D1' },
    { name: 'Biology', emoji: '🧬', color: '#96CEB4' },
    { name: 'Literature', emoji: '📚', color: '#FFEAA7' },
    { name: 'History', emoji: '🏛️', color: '#DDA0DD' },
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleSubjectSelect = (subjectName: string, index: number) => {
    setSubject(subjectName);
    setSelectedPreset(index);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  React.useEffect(() => {
    if (isRunning) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning, pulseAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isRunning ? ['#4ECDC4', '#44A08D'] : [colors.primary.main, colors.primary.light]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Study Timer
          </Text>
          {isRunning && (
            <View style={styles.statusBadge}>
              <View style={styles.recordingDot} />
              <Text variant="bodySmall" style={styles.statusText}>
                Recording
              </Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={isRunning ? ['#FF6B6B', '#FF8E53'] : ['#FFFFFF', '#F8FAFC']}
            style={styles.timerCard}
          >
            <Text variant="displayLarge" style={[
              styles.timerText,
              { color: isRunning ? colors.text.white : colors.primary.main }
            ]}>
              {formatTime(time)}
            </Text>
            <Text variant="bodyMedium" style={[
              styles.timerSubtext,
              { color: isRunning ? 'rgba(255,255,255,0.8)' : colors.text.secondary }
            ]}>
              {isRunning ? 'Focus time' : 'Ready to start'}
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.subjectSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Subject
          </Text>
          
          <TextInput
            label="What are you studying?"
            value={subject}
            onChangeText={(text) => {
              setSubject(text);
              setSelectedPreset(null);
            }}
            mode="outlined"
            style={styles.subjectInput}
            left={<TextInput.Icon icon="book-outline" />}
            outlineStyle={styles.inputOutline}
          />

          <View style={styles.presetsContainer}>
            {presetSubjects.map((preset, index) => (
              <Chip
                key={index}
                selected={selectedPreset === index}
                onPress={() => handleSubjectSelect(preset.name, index)}
                style={[
                  styles.presetChip,
                  selectedPreset === index && styles.selectedChip
                ]}
                textStyle={styles.chipText}
                icon={() => <Text style={styles.chipEmoji}>{preset.emoji}</Text>}
              >
                {preset.name}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.buttonSection}>
          <Button
            mode="contained"
            onPress={handleStartStop}
            style={[
              styles.mainButton,
              { backgroundColor: isRunning ? '#FF6B6B' : colors.primary.main }
            ]}
            contentStyle={styles.mainButtonContent}
            labelStyle={styles.mainButtonLabel}
            icon={isRunning ? 'pause' : 'play'}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <View style={styles.secondaryButtons}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.secondaryButton}
              contentStyle={styles.secondaryButtonContent}
              icon="refresh"
            >
              Reset
            </Button>
            
            <IconButton
              icon="bookmark-outline"
              size={24}
              style={styles.bookmarkButton}
              onPress={() => {}}
            />
          </View>
        </View>

        {time > 0 && (
          <Card style={styles.sessionCard}>
            <Card.Content style={styles.sessionContent}>
              <View style={styles.sessionHeader}>
                <Text variant="titleMedium" style={styles.sessionTitle}>
                  Current Session
                </Text>
                <View style={styles.sessionBadge}>
                  <Text variant="bodySmall" style={styles.sessionBadgeText}>
                    Active
                  </Text>
                </View>
              </View>
              
              <View style={styles.sessionDetails}>
                <View style={styles.sessionDetail}>
                  <Text variant="bodySmall" style={styles.sessionDetailLabel}>
                    Subject
                  </Text>
                  <Text variant="bodyLarge" style={styles.sessionDetailValue}>
                    {subject || 'Not specified'}
                  </Text>
                </View>
                
                <View style={styles.sessionDetail}>
                  <Text variant="bodySmall" style={styles.sessionDetailLabel}>
                    Duration
                  </Text>
                  <Text variant="bodyLarge" style={styles.sessionDetailValue}>
                    {formatTime(time)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 6,
  },
  statusText: {
    color: colors.text.white,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  timerContainer: {
    marginBottom: 32,
  },
  timerCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  timerText: {
    fontSize: 52,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  timerSubtext: {
    marginTop: 8,
    fontWeight: '500',
  },
  subjectSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  subjectInput: {
    backgroundColor: colors.background.paper,
    marginBottom: 16,
  },
  inputOutline: {
    borderColor: colors.surface.border,
    borderWidth: 1,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: colors.primary.light,
  },
  chipText: {
    fontSize: 12,
  },
  chipEmoji: {
    fontSize: 14,
  },
  buttonSection: {
    marginBottom: 24,
  },
  mainButton: {
    borderRadius: 16,
    marginBottom: 16,
  },
  mainButtonContent: {
    paddingVertical: 16,
  },
  mainButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: colors.surface.border,
  },
  secondaryButtonContent: {
    paddingVertical: 8,
  },
  bookmarkButton: {
    backgroundColor: colors.surface.light,
  },
  sessionCard: {
    borderRadius: 20,
    elevation: 2,
  },
  sessionContent: {
    padding: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionTitle: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  sessionBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    color: colors.success,
    fontWeight: '600',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDetail: {
    flex: 1,
  },
  sessionDetailLabel: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  sessionDetailValue: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});