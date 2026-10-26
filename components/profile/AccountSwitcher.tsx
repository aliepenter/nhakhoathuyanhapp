import React from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type SwitchAccount = { id: number; ho_va_ten: string; avatar_id?: unknown };

export function normalizeSwitchAccounts(value: unknown): SwitchAccount[] {
    if (!Array.isArray(value)) throw new Error('Danh sách tài khoản không hợp lệ.');
    const seen = new Set<number>();
    return value.flatMap(item => {
        if (!item || typeof item !== 'object') return [];
        const id = Number(item.id);
        if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return [];
        seen.add(id);
        return [{ id, ho_va_ten: typeof item.ho_va_ten === 'string' ? item.ho_va_ten : `Tài khoản #${id}`, avatar_id: item.avatar_id }];
    });
}

export function getAccountAvatarUri(avatar: unknown, serverUrl: string): string | undefined {
    const value = avatar && typeof avatar === 'object' && 'value' in avatar ? avatar.value : avatar;
    if (typeof value !== 'string' || !value.trim() || /^\d+$/.test(value.trim())) return undefined;
    const path = value.trim();
    if (/^https?:\/\//i.test(path)) return path;
    if (/^(?:img|uploads)\//.test(path.replace(/^\/+/, ''))) return `${serverUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return undefined;
}

type Props = {
    visible: boolean; accounts: SwitchAccount[]; currentId?: number; serverUrl: string;
    loading: boolean; error: string; switchingId: number | null;
    onClose: () => void; onRetry: () => void; onSelect: (id: number) => void;
};

export default function AccountSwitcher({ visible, accounts, currentId, serverUrl, loading, error, switchingId, onClose, onRetry, onSelect }: Props) {
    const switching = switchingId !== null;
    return <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!switching) onClose(); }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
            <Pressable accessibilityLabel="Đóng danh sách tài khoản" disabled={switching} onPress={onClose} style={{ flex: 1 }} />
            <SafeAreaView edges={['bottom']} style={{ maxHeight: '65%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                    <Text accessibilityRole="header" style={{ flex: 1, fontSize: 18, fontWeight: '600' }}>Chuyển đổi tài khoản</Text>
                    <Pressable accessibilityRole="button" accessibilityLabel="Đóng" disabled={switching} onPress={onClose} hitSlop={12}><Text style={{ color: '#555' }}>Đóng</Text></Pressable>
                </View>
                {loading ? <ActivityIndicator accessibilityLabel="Đang tải tài khoản" style={{ margin: 24 }} /> : error ?
                    <View style={{ padding: 20 }}><Text accessibilityRole="alert" style={{ color: '#b91c1c' }}>{error}</Text><Pressable onPress={onRetry} accessibilityRole="button" style={{ paddingVertical: 16 }}><Text>Thử lại</Text></Pressable></View> :
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                        {!accounts.length && <Text>Chưa tìm thấy tài khoản cùng số điện thoại.</Text>}
                        {accounts.map(item => {
                            const selected = Number(currentId) === item.id, uri = getAccountAvatarUri(item.avatar_id, serverUrl);
                            return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.ho_va_ten} accessibilityState={{ selected, disabled: selected || switching }}
                                disabled={selected || switching} onPress={() => { if (!selected && !switching) onSelect(item.id); }}
                                style={{ flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, borderRadius: 15, backgroundColor: selected ? '#e5f5e0' : '#f2f2f2', opacity: switching && switchingId !== item.id ? 0.6 : 1 }}>
                                {uri ? <Image source={{ uri }} style={{ width: 45, height: 45, borderRadius: 23 }} /> :
                                    <View style={{ width: 45, height: 45, borderRadius: 23, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20 }}>{item.ho_va_ten.trim().charAt(0).toUpperCase() || '?'}</Text></View>}
                                <Text style={{ flex: 1, marginLeft: 12, fontWeight: '600' }}>{item.ho_va_ten}</Text>
                                {switchingId === item.id ? <ActivityIndicator accessibilityLabel="Đang chuyển tài khoản" /> : selected ? <Text style={{ color: '#34851d' }}>Đang dùng</Text> : null}
                            </Pressable>;
                        })}
                    </ScrollView>}
            </SafeAreaView>
        </View>
    </Modal>;
}
