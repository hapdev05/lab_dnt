import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  actionText: string;
}

export default function MiCardScreen() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactList: ContactInfo[] = [
    {
      icon: '📞',
      title: 'Phone',
      value: '+84 987 654 321',
      actionText: 'Calling...',
    },
    {
      icon: '✉️',
      title: 'Email',
      value: 'developer@hapdev.io',
      actionText: 'Email copied',
    },
    {
      icon: '🌐',
      title: 'GitHub / Website',
      value: 'github.com/hapdev05',
      actionText: 'Opening GitHub profile...',
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'Ho Chi Minh City, Vietnam',
      actionText: 'Location copied',
    },
  ];

  const handleCardPress = (item: ContactInfo) => {
    setCopiedField(item.title);
    Alert.alert(item.title, `${item.value}\n(${item.actionText})`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const skills = [
    'React Native',
    'TypeScript',
    'Expo SDK',
    'Mobile UI/UX',
    'State Management',
    'REST APIs',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Lab Header Tag */}
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>LAB 2 • MICARD UI COMPONENTS</Text>
        </View>

        {/* Profile Card Container */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>👨‍💻</Text>
            </View>
          </View>

          <Text style={styles.name}>HAP DEV</Text>
          <Text style={styles.title}>REACT NATIVE ENGINEER</Text>

          <View style={styles.divider} />
        </View>

        {/* Bio */}
        <Text style={styles.bioText}>
          Passionate about crafting pixel-perfect, high-performance mobile
          experiences with React Native and modern web architectures.
        </Text>

        {/* Contact Info Cards */}
        <View style={styles.contactList}>
          {contactList.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.card}
              onPress={() => handleCardPress(item)}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skills Section */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsHeading}>CORE TECHNOLOGIES</Text>
          <View style={styles.skillsWrapper}>
            {skills.map((skill, idx) => (
              <View key={idx} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042F2E', // Rich dark teal aesthetic
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  tagBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#14B8A6',
    marginBottom: 20,
  },
  tagText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2DD4BF',
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#115E59',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#5EEAD4',
  },
  avatarText: {
    fontSize: 48,
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#99F6E4',
    letterSpacing: 2.5,
  },
  divider: {
    width: 150,
    height: 2,
    backgroundColor: '#14B8A6',
    opacity: 0.5,
    marginTop: 14,
    marginBottom: 6,
    borderRadius: 1,
  },
  bioText: {
    color: '#CCFBF1',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.9,
  },
  contactList: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134E4A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    color: '#99F6E4',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#5EEAD4',
    fontWeight: '300',
    marginLeft: 8,
  },
  skillsSection: {
    width: '100%',
    maxWidth: 380,
    marginTop: 24,
    backgroundColor: 'rgba(17, 94, 89, 0.5)',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.2)',
  },
  skillsHeading: {
    color: '#99F6E4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  skillPill: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2DD4BF',
  },
  skillText: {
    color: '#F0FDFA',
    fontSize: 12,
    fontWeight: '600',
  },
});
