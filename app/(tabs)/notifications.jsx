import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
    Image,
} from 'react-native'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'local_notifications_v1'

const sampleNotifications = [
    { id: 'n1', title: 'New assignment posted', body: 'Machine Learning — Homework 1', time: '2h ago', unread: true },
    { id: 'n2', title: 'Quiz starting', body: 'Quiz 1 in Algorithms starts tomorrow', time: '1d ago', unread: true },
    { id: 'n3', title: 'Profile updated', body: 'Your profile was saved successfully', time: '3d ago', unread: false },
]

export default function NotificationsPage() {
    const [sending, setSending] = useState(false)
    const [items, setItems] = useState([])

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY)
                if (raw) setItems(JSON.parse(raw))
                else {
                    setItems(sampleNotifications)
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications))
                }
            } catch (e) {
                console.warn('load notifications', e)
                setItems(sampleNotifications)
            }
        }
        load()
    }, [])

    const persist = async (next) => {
        setItems(next)
        try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) { console.warn(e) }
    }

    const toggleRead = (id) => {
        const next = items.map(i => i.id === id ? { ...i, unread: !i.unread } : i)
        persist(next)
    }

    const sendTestNotification = async () => {
        setSending(true)
        await Notifications.scheduleNotificationAsync({
            content: { title: 'New Notification', body: 'This is a test notification' },
            trigger: { seconds: 1 },
        })
        setSending(false)
        Alert.alert('Notification Sent', 'Appears in one second')
    }

    const showToken = async () => {
        const token = await AsyncStorage.getItem('push_token')
        if (!token) Alert.alert('No token found', 'Open profile first')
        else Alert.alert('Expo Push Token', token)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, item.unread && styles.unread]} onPress={() => toggleRead(item.id)} activeOpacity={0.85}>
            <View style={styles.avatar}>
                <Image source={require('../../assets/images/anuwat.png')} style={styles.avatarImg} />
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.body}</Text>
            </View>
            <View style={styles.cardRight}>
                <Text style={styles.cardTime}>{item.time}</Text>
                <Text style={[styles.badge, item.unread ? styles.badgeUnread : styles.badgeRead]}>{item.unread ? 'NEW' : 'READ'}</Text>
            </View>
        </TouchableOpacity>
    )

    const clearAll = async () => {
        const next = items.map(i => ({ ...i, unread: false }))
        persist(next)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={clearAll} style={styles.iconBtn}><Text style={styles.iconTxt}>Mark all read</Text></TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />

            <View style={styles.footerRow}>
                <TouchableOpacity style={styles.btn} onPress={sendTestNotification}>
                    <Text style={styles.txt}>{sending ? 'Sending...' : 'Send Test Notification'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineBtn} onPress={showToken}>
                    <Text style={styles.outlineTxt}>Show Push Token</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { paddingHorizontal: 8, paddingVertical: 6 },
    iconTxt: { color: '#6b7280', fontSize: 13 },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eef2ff' },
    unread: { borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
    avatar: { width: 44, height: 44, borderRadius: 10, overflow: 'hidden', marginRight: 12 },
    avatarImg: { width: '100%', height: '100%' },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    cardText: { color: '#6b7280', marginTop: 4 },
    cardRight: { alignItems: 'flex-end', marginLeft: 12 },
    cardTime: { color: '#9ca3af', fontSize: 12 },
    badge: { marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '700' },
    badgeUnread: { backgroundColor: '#eef2ff', color: '#3b82f6' },
    badgeRead: { backgroundColor: '#f1f5f9', color: '#6b7280' },

    footerRow: { padding: 16, flexDirection: 'row', gap: 12 },
    btn: { flex: 1, backgroundColor: '#3b82f6', padding: 12, borderRadius: 10, alignItems: 'center' },
    txt: { color: '#fff', fontWeight: '700', textAlign: 'center', textAlignVertical: 'center' },
    outlineBtn: { flex: 1, borderWidth: 1, borderColor: '#3b82f6', padding: 12, borderRadius: 10, alignItems: 'center' },
    outlineTxt: { color: '#3b82f6', fontWeight: '700' },
})
