import React, { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert, Platform, Image, StyleSheet } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { User, LogOut, Edit2, Camera, Image as ImageIcon } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import * as Notifications from "expo-notifications"

const ProfilePage = () => {
    const router = useRouter()

    const [profile, setProfile] = useState({
        
        firstName: "Kim",
        lastName: "Yong Bok",
        email: "kimyongbok@example.com",
        profileImage: ""
    })

    const [isEditing, setIsEditing] = useState(false)

    useFocusEffect(
        useCallback(() => {
            loadUserData()
        }, [])
    )

    useEffect(() => {
        requestPermissions()
        registerForNotifications()
    }, [])

    const requestPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (mediaStatus !== 'granted') {
                Alert.alert('Permission Required', 'Permission to access media library is required to pick photos!');
            }
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus !== 'granted') {
                Alert.alert('Permission Required', 'Permission to use camera is required to take photos!');
            }
        }
    }

    const registerForNotifications = async () => {
        try {
            const perm = await Notifications.requestPermissionsAsync()
            if (perm.status === "granted") {
                try {
                    const token = (await Notifications.getExpoPushTokenAsync()).data
                    await AsyncStorage.setItem("push_token", token)
                } catch (tokenError) {
                    console.warn("Could not retrieve push token. Please ensure projectId is set in app.json")
                }
            }
        } catch (error) {
            console.error("Notification permission error:", error)
        }
    }

    const loadUserData = async () => {
        try {
            const user = await AsyncStorage.getItem("user")
            if (user) {
                const data = JSON.parse(user)
                
                const full = data.displayName || ""
                const split = full.split(" ")

                setProfile({
                    firstName: split[0] || "",
                    lastName: split.slice(1).join(" ") || "",
                    email: data.email || "",
                    profileImage: data.profileImage || "" 
                })
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
        })
        if (!result.canceled && result.assets && result.assets[0].uri) {
            updateImage(result.assets[0].uri)
        }
    }

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({ 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
        })
        if (!result.canceled && result.assets && result.assets[0].uri) {
            updateImage(result.assets[0].uri)
        }
    }

    const updateImage = async (uri) => {
        try {
            setProfile({ ...profile, profileImage: uri })

            const user = await AsyncStorage.getItem("user")
            if (user) {
                const updated = { ...JSON.parse(user), profileImage: uri }
                await AsyncStorage.setItem("user", JSON.stringify(updated))
                console.log("Image updated successfully:", uri)
            }
        } catch (error) {
            console.error("Error updating image:", error)
            Alert.alert("Error", "Failed to update image")
        }
    }

    const handleSaveChanges = async () => {
        if (!isEditing) return

        try {
            const stored = await AsyncStorage.getItem("user")
            if (stored) {
                const data = JSON.parse(stored)
                const full = profile.firstName.trim() + " " + profile.lastName.trim()

                const update = {
                    ...data,
                    displayName: full.trim(), 
                    email: profile.email,
                    profileImage: profile.profileImage
                }

                await AsyncStorage.setItem("user", JSON.stringify(update))
                console.log("Profile saved:", update)
                setIsEditing(false)
                Alert.alert("✅ Success", "Profile updated successfully")
            }
        } catch (error) {
            console.error("Error saving changes:", error)
            Alert.alert("Error", "Failed to save")
        }
    }

    const performSignOut = async () => {
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
        router.replace("/auth")
    }

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel" },
            { text: "Sign Out", style: "destructive", onPress: performSignOut }
        ])
    }

    const displayName = (profile.firstName + " " + profile.lastName).trim()

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Profile Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.avatarContainer}>
                        {profile.profileImage ? (
                            <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <User size={56} color="#9CA3AF" strokeWidth={1.5} />
                            </View>
                        )}
                        
                        {isEditing && (
                            <View style={styles.imageActionButtons}>
                                <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
                                    <ImageIcon size={16} color="#fff" strokeWidth={2} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
                                    <Camera size={16} color="#fff" strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.displayName}>{displayName}</Text>
                        <Text style={styles.emailText}>{profile.email}</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.editBtn, isEditing && styles.editBtnActive]} 
                        onPress={() => {
                            if (isEditing) loadUserData();
                            setIsEditing(!isEditing);
                        }}
                    >
                        <Edit2 size={18} color={isEditing ? "#3B82F6" : "#6B7280"} strokeWidth={2} />
                        <Text style={[styles.editText, isEditing && styles.editTextActive]}>
                            {isEditing ? "Cancel" : "Edit"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Edit Form */}
                {isEditing && (
                    <View style={styles.formCard}>
                        <Text style={styles.formLabel}>First Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={profile.firstName} 
                            placeholder="First Name" 
                            placeholderTextColor="#D1D5DB"
                            onChangeText={(t) => setProfile({...profile, firstName: t})}
                        />

                        <Text style={styles.formLabel}>Last Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={profile.lastName} 
                            placeholder="Last Name" 
                            placeholderTextColor="#D1D5DB"
                            onChangeText={(t) => setProfile({...profile, lastName: t})}
                        />

                        <Text style={styles.formLabel}>Email</Text>
                        <TextInput 
                            editable={isEditing} 
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={profile.email} 
                            placeholder="Email"
                            placeholderTextColor="#D1D5DB"
                            onChangeText={(t) => setProfile({...profile, email: t})}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Static Info (when not editing) */}
                {!isEditing && (
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>First Name</Text>
                            <Text style={styles.infoValue}>{profile.firstName}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Last Name</Text>
                            <Text style={styles.infoValue}>{profile.lastName}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{profile.email}</Text>
                        </View>
                    </View>
                )}

                {/* Sign Out Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
                    <LogOut size={18} color="#EF4444" strokeWidth={2} />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F3F4F6"
    },
    scrollContainer: {
        paddingBottom: 40
    },
    headerCard: {
        backgroundColor: "#FFFFFF",
        margin: 16,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#3B82F6",
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#D1D5DB",
    },
    imageActionButtons: {
        position: "absolute",
        bottom: 0,
        right: 0,
        flexDirection: "row",
        gap: 6,
    },
    imageActionBtn: {
        backgroundColor: "#3B82F6",
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    profileInfo: {
        alignItems: "center",
        marginBottom: 12,
    },
    displayName: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: "#6B7280",
    },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
    },
    editBtnActive: {
        borderColor: "#3B82F6",
    },
    editText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    editTextActive: {
        color: "#3B82F6",
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        margin: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    formLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#1F2937",
    },
    disabledInput: {
        backgroundColor: "#F3F4F6",
        color: "#9CA3AF",
    },
    saveBtn: {
        backgroundColor: "#3B82F6",
        marginTop: 24,
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        margin: 16,
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 20,
    },
    logoutBtn: {
        marginHorizontal: 16,
        marginTop: 20,
        paddingVertical: 13,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderWidth: 1.5,
        borderColor: "#FCA5A5",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#DC2626",
    }
})

export default ProfilePage;
