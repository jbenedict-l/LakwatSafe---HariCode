import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, RootStackParamList } from "./app";

// Type definition for navigation prop
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

// Firebase Auth error codes type
type FirebaseAuthErrorCode =
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/email-already-in-use"
  | "auth/invalid-email"
  | "auth/weak-password";

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleAuth = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Logged in successfully!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Account created successfully!");
      }
      navigation.navigate("Main");
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = "An error occurred";

      switch (authError.code as FirebaseAuthErrorCode) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account already exists with this email";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = authError.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = (): void => {
    navigation.navigate("Main");
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleAuthMode = (): void => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={["#1a365d", "#2d5a8a", "#4a90e2"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.roadIllustration}>
                <View style={styles.road} />
                <View style={styles.roadLine} />
                <View style={styles.mapPin}>
                  <Ionicons name="location" size={16} color="#fff" />
                </View>
              </View>
            </View>

            <Text style={styles.appName}>LakwatSafe</Text>
            <Text style={styles.authTitle}>
              {isLogin ? "Sign In" : "Sign Up"}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#a0a0a0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password:</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#a0a0a0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#a0a0a0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#a0a0a0"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.authButton, loading && styles.disabledButton]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? "Sign In" : "Sign Up"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons
                name="logo-google"
                size={20}
                color="#fff"
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>
                Sign in using Google Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons
                name="logo-facebook"
                size={20}
                color="#fff"
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>
                Sign in using Facebook Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestAccess}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.toggleAuth}
              onPress={toggleAuthMode}
            >
              <Text style={styles.toggleAuthText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: -10,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  roadIllustration: {
    width: 60,
    height: 30,
    position: "relative",
  },
  road: {
    width: 60,
    height: 20,
    backgroundColor: "#34495e",
    borderRadius: 10,
    position: "absolute",
  },
  roadLine: {
    width: 40,
    height: 2,
    backgroundColor: "#fff",
    position: "absolute",
    top: 9,
    left: 10,
  },
  mapPin: {
    position: "absolute",
    top: -5,
    right: 5,
    width: 20,
    height: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  authTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "rgba(52, 73, 94, 0.8)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(74, 144, 226, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 12,
    padding: 5,
  },
  authButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  authButtonText: {
    color: "#2c3e50",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "#fff",
    paddingHorizontal: 15,
    fontSize: 12,
  },
  socialButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  guestButton: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#e3f2fd",
    fontSize: 14,
    fontStyle: "italic",
  },
  toggleAuth: {
    alignItems: "center",
    marginTop: 20,
  },
  toggleAuthText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AuthScreen;
