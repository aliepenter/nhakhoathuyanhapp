import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TinhTrang({ tinhtrang, order }: any) {
    return (
        <View style={styles.section}>
            <View style={styles.titleWrap}>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="tooth-outline" size={20} color="#B42318" />
                </View>
                <View style={styles.titleTextWrap}>
                    <Text style={styles.title}>{order}. Tình trạng răng miệng</Text>
                    <Text style={styles.subtitle}>Điểm cần lưu ý trong buổi này</Text>
                </View>
            </View>
            <View style={styles.alertBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#B42318" />
                <Text style={styles.alertText}>{tinhtrang}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FEE4E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    titleTextWrap: {
        flex: 1,
    },
    title: {
        color: '#10240B',
        fontFamily: 'Inter-Bold',
        fontSize: 17,
    },
    subtitle: {
        color: '#768172',
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        marginTop: 2,
    },
    alertBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF7F5',
        borderWidth: 1,
        borderColor: '#FED7D2',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    alertText: {
        flex: 1,
        color: '#8F1D14',
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 8,
    },
});
