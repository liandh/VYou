import { useSocialAuth } from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Index() {
  const { handleSocialAuth, isLoading } = useSocialAuth();
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleContinue = () => {
    if (!identifier) return;
    setShowPasswordInput(true);
  };

  const handleLogin = async () => {
    if (!identifier || !password) return;

    setIsLoggingIn(true);

    try {
      if (isSignUpMode) {
        if (!signUp) return;

        const result = await signUp.create({
          emailAddress: identifier,
          password,
        });

        if (result.status === "complete" && setActive) {
          await setActive({ session: result.createdSessionId });
          router.replace("/(tabs)");
        } else {
          Alert.alert("Signup Incomplete", "Please check your email for verification.");
        }
      } else {
        if (!signIn) return;

        const result = await signIn.create({
          identifier,
          password,
        });

        if (result.status === "complete" && setActive) {
          await setActive({ session: result.createdSessionId });
          router.replace("/(tabs)");
        } else {
          Alert.alert("Login Incomplete", "Please complete all login steps.");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 bg-white">
            <View className="flex-1 px-8 justify-between">
              <View className="flex-1 justify-center">
                {/* DEMO IMAGE */}
                <View className="items-center">
                  <Image source={require("../../assets/images/auth1.png")} className="size-96" resizeMode="contain" />
                </View>

                {/* Social Auth Buttons */}
                <View className="flex-col gap-2">
                  {/* Google Sign In */}
                  <TouchableOpacity
                    className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
                    onPress={() => handleSocialAuth("oauth_google")}
                    disabled={isLoading}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#4285F4" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Image source={require("../../assets/images/google.png")} className="size-10 mr-3" resizeMode="contain" />
                        <Text className="text-black font-medium text-base">Continue with Google</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Apple Sign In */}
                  <TouchableOpacity
                    className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
                    onPress={() => handleSocialAuth("oauth_apple")}
                    disabled={isLoading}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Image source={require("../../assets/images/apple.png")} className="size-8 mr-3" resizeMode="contain" />
                        <Text className="text-black font-medium text-base">Continue with Apple</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Email/Username Auth */}
                <View className="mt-6">
                  <TextInput
                    placeholder="Email or username"
                    className="border border-gray-300 rounded-full py-3 px-6 mb-2"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  {!showPasswordInput && (
                    <TouchableOpacity onPress={handleContinue} className="bg-blue-500 rounded-full py-3 px-6 items-center">
                      <Text className="text-white font-medium">Continue</Text>
                    </TouchableOpacity>
                  )}

                  {showPasswordInput && (
                    <>
                      <TextInput
                        placeholder="Password"
                        className="border border-gray-300 rounded-full py-3 px-6 mb-2 mt-2"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />

                      <TouchableOpacity onPress={handleLogin} className="bg-blue-600 rounded-full py-3 px-6 items-center" disabled={isLoggingIn}>
                        <Text className="text-white font-medium">
                          {isLoggingIn ? (isSignUpMode ? "Signing up..." : "Logging in...") : isSignUpMode ? "Sign Up" : "Log In"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Mode Switch Link */}
                  <TouchableOpacity onPress={() => setIsSignUpMode(!isSignUpMode)} className="mt-3 flex-row justify-center">
                    <Text className="text-sm text-gray-600">{isSignUpMode ? "Already have an account? " : "Don't have an account? "}</Text>
                    <Text className="text-sm text-blue-600 font-medium">{isSignUpMode ? "Log in" : "Sign up"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Terms and Privacy */}
                <Text className="text-center text-gray-500 text-xs leading-4 mt-4 px-2">
                  By signing up, you agree to our <Text className="text-blue-500">Terms</Text>, <Text className="text-blue-500">Privacy Policy</Text>,
                  and <Text className="text-blue-500">Cookie Use</Text>.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
