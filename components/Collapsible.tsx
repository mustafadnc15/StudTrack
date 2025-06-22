import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name={isOpen ? 'chevron.down' : 'chevron.right'}
          size={16}
          color="#007AFF"
        />
        <ThemedText style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});