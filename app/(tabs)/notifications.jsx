import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

const NotificationsPage = () => {
    const [sending, setSending] = useState(false)

    const sendTestNotification = async () => {
        setSending(true)
        await Notifications.scheduleNotificationAsync({
            content:{ title:"New Notification", body:"Hello Kim Yong Bok" },
            trigger:{ seconds:1 }
        })
        setSending(false)
        Alert.alert("Notification Sent", "Appears in one second")
    }

    const showToken = async () => {
        const token = await AsyncStorage.getItem("push_token")
        if (!token) Alert.alert("No token found","Open profile first")
        else Alert.alert("Expo Push Token",token)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications Center</Text>

            <TouchableOpacity style={styles.btn} onPress={sendTestNotification}>
                <Text style={styles.txt}>{sending ? "Sending..." : "Send Test Notification"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn} onPress={showToken}>
                <Text style={styles.outlineTxt}>Show Push Token</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{flex:1,justifyContent:"center",alignItems:"center",padding:20,backgroundColor:"#fff"},
    title:{fontSize:24,fontWeight:"800",marginBottom:30,color:"#ff92b5"},

    btn:{backgroundColor:"#ff92b5",padding:14,borderRadius:14,width:"80%",marginBottom:15,alignItems:"center"},
    txt:{color:"#fff",fontSize:16,fontWeight:"700"},

    outlineBtn:{borderWidth:2,borderColor:"#ff92b5",padding:14,borderRadius:14,width:"80%",alignItems:"center"},
    outlineTxt:{color:"#ff92b5",fontSize:16,fontWeight:"700"}
})

export default NotificationsPage;
