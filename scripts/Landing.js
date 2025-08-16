import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scrollToAbout = () => {
    scrollViewRef.current?.scrollTo({ y: 800, animated: true });
  };

  const features = [
    {
      id: 1,
      title: 'Real-time Hazard Map',
      description: 'See flood, blocked paths, poor lighting, and other hazards around you.',
      icon: 'map-outline',
    },
    {
      id: 2,
      title: 'Suggested Safe Routes',
      description: 'Know routes with community ratings for safety and comfort.',
      icon: 'navigate-outline',
    },
    {
      id: 3,
      title: 'Incident Reporting',
      description: 'Report harassment, reckless driving, or overcharging without revealing your identity.',
      icon: 'warning-outline',
    },
    {
      id: 4,
      title: 'Community Board',
      description: 'Ask for or give route suggestions, and rate the reliability of shared routes.',
      icon: 'people-outline',
    },
    {
      id: 5,
      title: 'Accessibility Filters',
      description: 'Choose routes that are flood-free, well-lit, or wheelchair-friendly.',
      icon: 'accessibility-outline',
    },
  ];

  const differentiators = [
    'No mandatory sign-up — access safety info instantly.',
    'Real-time hazard pins that expire automatically to avoid outdated info.',
    'Anonymous incident reports, even without plate numbers.',
    'Inclusive routing filters like wheelchair-friendly paths.',
  ];

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#1a365d', '#2d5a8a', '#4a90e2']}
        style={styles.heroSection}
      >
        <Animated.View
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Jeep Illustration */}
          <View style={styles.jeepContainer}>
            <View style={styles.jeepIllustration}>
              <View style={styles.jeepBody}>
                <View style={styles.jeepWindshield} />
                <View style={styles.jeepDoor} />
                <View style={styles.jeepWindow} />
              </View>
              <View style={styles.jeepWheels}>
                <View style={styles.wheel} />
                <View style={styles.wheel} />
              </View>
            </View>
            <View style={styles.mapPin}>
              <Icon name="location" size={24} color="#fff" />
            </View>
          </View>

          <Text style={styles.appName}>LakwatSafe</Text>
          <Text style={styles.tagline}>
            Your community-powered map for safer, hassle-free lakwatsa
          </Text>
          <Text style={styles.subtitle}>From hazards to help — all in one map.</Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.authButtonText}>Sign Up/Log in</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Features You'll Use Every Day</Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={scrollToAbout}
            activeOpacity={0.7}
          >
            <View style={styles.featureIcon}>
              <Icon name={feature.icon} size={24} color="#4A90E2" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About LakwatSafe</Text>
        <Text style={styles.aboutSubtitle}>
          Your community-powered safety companion for everyday commuting.
        </Text>

        <Text style={styles.aboutDescription}>
          LakwatSafe is a mobile-first web app that helps commuters travel smarter and safer. 
          It combines real-time hazard reports, safe route suggestions, and anonymous incident 
          reporting — all contributed by the community and verified by local authorities where possible.
        </Text>

        <View style={styles.missionBox}>
          <Text style={styles.missionText}>
            To make everyday travel safer, faster, and more informed by connecting commuters 
            through real-time, crowd-sourced safety updates.
          </Text>
        </View>

        <Text style={styles.differentiatorTitle}>What Makes Us Different</Text>
        {differentiators.map((item, index) => (
          <View key={index} style={styles.differentiatorItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.differentiatorText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 LakwatSafe. Safe travels, always.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    minHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  jeepContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  jeepIllustration: {
    width: 120,
    height: 80,
  },
  jeepBody: {
    width: 120,
    height: 60,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    position: 'relative',
  },
  jeepWindshield: {
    width: 30,
    height: 25,
    backgroundColor: '#87CEEB',
    position: 'absolute',
    top: 5,
    left: 10,
    borderRadius: 4,
  },
  jeepDoor: {
    width: 20,
    height: 30,
    backgroundColor: '#357ABD',
    position: 'absolute',
    top: 15,
    left: 50,
    borderRadius: 2,
  },
  jeepWindow: {
    width: 25,
    height: 20,
    backgroundColor: '#87CEEB',
    position: 'absolute',
    top: 10,
    right: 15,
    borderRadius: 3,
  },
  jeepWheels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  wheel: {
    width: 20,
    height: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
  },
  mapPin: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 30,
    height: 30,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#e6f3ff',
    textAlign: 'center',
    marginBottom: 40,
  },
  ctaButton: {
    backgroundColor: '#000',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  authButton: {
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#e3f2fd',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  aboutSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  aboutSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'justify',
  },
  missionBox: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    marginBottom: 24,
  },
  missionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  differentiatorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  differentiatorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  differentiatorText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  footerText: {
    color: '#bdc3c7',
    fontSize: 12,
  },
});

export default LandingScreen;