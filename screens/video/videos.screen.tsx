import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, Image, Pressable, StyleSheet, Text, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVideos } from '@/lib/apiCall';
import { FeedVideo, normalizeVideoFeed, normalizeVideoProgress, shuffleShorts } from '@/utils/youtube';
import FeedVideoCard from '@/components/video/FeedVideoCard';

const STORAGE_KEY = 'mybrace.video-library.v1';
type Filter = 'videos' | 'shorts' | 'saved';

export default function VideosScreen() {
    const focused = useIsFocused();
    const [foreground, setForeground] = useState(AppState.currentState === 'active');
    const [videos, setVideos] = useState<FeedVideo[]>([]);
    const [shorts, setShorts] = useState<FeedVideo[]>([]);
    const [saved, setSaved] = useState<string[]>([]);
    const [filter, setFilter] = useState<Filter>('shorts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [storageError, setStorageError] = useState('');
    const [index, setIndex] = useState(0);
    const [playerVisible, setPlayerVisible] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const list = useRef<FlatList<FeedVideo>>(null);
    const viewport = useRef<View>(null);
    const selectedIndex = useRef(0);
    const fullscreenRef = useRef(false);
    const resizing = useRef(false);
    const currentSize = useRef({ width: 0, height: 0 });
    const layoutFrame = useRef<number | null>(null);
    const progress = useRef<Record<string, number>>({});
    const savedRef = useRef<string[]>([]);
    const previousShortFirst = useRef<string | null>(null);
    const writes = useRef(Promise.resolve());
    const mounted = useRef(false);
    const request = useRef(0);
    const libraryLoaded = useRef(false);

    const load = useCallback(async () => {
        const sequence = ++request.current;
        setLoading(true); setError('');
        try {
            if (!libraryLoaded.current) {
                try {
                    const raw = await AsyncStorage.getItem(STORAGE_KEY);
                    const data = raw ? JSON.parse(raw) : {};
                    if (!mounted.current || sequence !== request.current) return;
                    savedRef.current = Array.isArray(data?.saved)
                        ? data.saved.filter((id: unknown) => typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id)) : [];
                    progress.current = normalizeVideoProgress(data?.progress);
                    previousShortFirst.current = typeof data?.lastShortFirst === 'string' ? data.lastShortFirst : null;
                    setSaved(savedRef.current);
                } catch { if (mounted.current) setStorageError('Không đọc được video đã lưu trên máy.'); }
                libraryLoaded.current = true;
            }
            const response = await getVideos();
            if (!response || response.code !== 200) throw new Error('Request failed');
            const items = normalizeVideoFeed(response.data);
            if (mounted.current && sequence === request.current) setVideos(items);
        } catch {
            if (mounted.current && sequence === request.current) setError('Chưa tải được video. Kiểm tra kết nối và thử lại.');
        } finally {
            if (mounted.current && sequence === request.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        void load();
        const subscription = AppState.addEventListener('change', state => setForeground(state === 'active'));
        return () => {
            mounted.current = false; request.current++; subscription.remove();
            if (layoutFrame.current !== null) cancelAnimationFrame(layoutFrame.current);
        };
    }, [load]);

    const persist = useCallback(() => {
        const payload = JSON.stringify({ saved: savedRef.current, progress: progress.current, lastShortFirst: previousShortFirst.current });
        writes.current = writes.current.then(() => AsyncStorage.setItem(STORAGE_KEY, payload)).catch(() => {
            if (mounted.current) setStorageError('Chưa lưu được trên máy. Dữ liệu có thể mất khi đóng App.');
        });
    }, []);
    const toggleSave = useCallback((id: string) => {
        savedRef.current = savedRef.current.includes(id)
            ? savedRef.current.filter(value => value !== id) : [...savedRef.current, id];
        setSaved(savedRef.current); persist();
    }, [persist]);
    const onProgress = useCallback((id: string, seconds: number) => {
        if (!Number.isFinite(seconds) || seconds < 0) return;
        const next = { ...progress.current };
        delete next[id];
        progress.current = normalizeVideoProgress({ ...next, [id]: Math.floor(seconds) });
        persist();
    }, [persist]);

    useLayoutEffect(() => {
        if (!focused || filter !== 'shorts' || !videos.length) return;
        const next = shuffleShorts(videos, previousShortFirst.current);
        setShorts(next);
        if (next.length) {
            previousShortFirst.current = next[0].id;
            persist();
        }
    }, [focused, filter, videos, persist]);

    const visible = useMemo(() => filter === 'shorts' ? shorts
        : videos.filter(video => filter === 'saved' ? saved.includes(video.id) : !video.isShort), [videos, shorts, saved, filter]);
    const listKey = `${filter}:${visible.map(video => video.id).join(',')}`;
    // Only a different list resets selection. Fullscreen changes viewport height.
    useEffect(() => {
        selectedIndex.current = 0; setIndex(0); setPlayerVisible(true);
        list.current?.scrollToOffset({ offset: 0, animated: false });
    }, [listKey]);
    const alignSelectedVideo = useCallback((width: number, height: number) => {
        if (width <= 0 || height <= 0 || fullscreenRef.current) return;
        resizing.current = true;
        currentSize.current = { width, height };
        setSize(old => old.width === width && old.height === height ? old : { width, height });
        if (layoutFrame.current !== null) cancelAnimationFrame(layoutFrame.current);
        layoutFrame.current = requestAnimationFrame(() => {
            list.current?.scrollToOffset({ offset: selectedIndex.current * height, animated: false });
            layoutFrame.current = requestAnimationFrame(() => {
                resizing.current = false;
                layoutFrame.current = null;
            });
        });
    }, []);
    const onFullScreenChange = useCallback((value: boolean) => {
        fullscreenRef.current = value;
        setFullscreen(value);
        if (value) return;
        resizing.current = true;
        if (layoutFrame.current !== null) cancelAnimationFrame(layoutFrame.current);
        layoutFrame.current = requestAnimationFrame(() => {
            if (viewport.current) {
                viewport.current.measure((_x, _y, width, height) => {
                    if (mounted.current) alignSelectedVideo(width, height);
                });
            } else {
                alignSelectedVideo(currentSize.current.width, currentSize.current.height);
            }
        });
    }, [alignSelectedVideo]);
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken<FeedVideo>[] }) => {
        if (fullscreenRef.current || resizing.current) return;
        const first = viewableItems.find(item => item.isViewable);
        setPlayerVisible(!!first);
        if (first?.index != null) { selectedIndex.current = first.index; setIndex(first.index); }
    }).current;
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;
    const move = (direction: number) => {
        const next = Math.max(0, Math.min(visible.length - 1, index + direction));
        list.current?.scrollToOffset({ offset: next * size.height, animated: true });
    };

    return <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        {filter !== 'shorts' && <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" hitSlop={8} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.headerButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <View style={styles.heading}><Text style={styles.title}>Video</Text><Text style={styles.subtitle}>Cùng bạn chăm sóc nụ cười</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Tải lại video" disabled={loading} onPress={load} style={styles.headerButton}>
                <Ionicons name="refresh" size={22} color="#a6e67e" />
            </Pressable>
        </View>}
        <View style={[styles.filters, filter === 'shorts' && styles.shortFilters]}>
            {filter === 'shorts' && <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" hitSlop={8}
                onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.headerButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>}
            {([['shorts', 'Shorts'], ['videos', 'Video'], ['saved', 'Đã lưu']] as const).map(([value, label]) =>
                <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }}
                    onPress={() => setFilter(value)} style={[styles.chip, filter === value && styles.selectedChip]}>
                    <Text style={[styles.chipText, filter === value && styles.selectedText]}>{label}</Text>
                </Pressable>)}
        </View>
        {!!storageError && filter !== 'shorts' && <Text style={styles.notice}>{storageError}</Text>}
        <View ref={viewport} style={styles.viewport} onLayout={event => {
            const { width, height } = event.nativeEvent.layout;
            alignSelectedVideo(width, height);
        }}>
            {loading ? <View style={styles.empty}><ActivityIndicator color="#a6e67e" /><Text style={styles.emptyText}>Đang tải video…</Text></View>
                : error ? <View style={styles.empty}><Text style={styles.emptyText}>{error}</Text><Pressable onPress={load} style={styles.chip}><Text style={styles.chipText}>Thử lại</Text></Pressable></View>
                : !visible.length ? <View style={styles.empty}>
                    <Ionicons name={filter === 'saved' ? 'bookmark-outline' : 'play-circle-outline'} size={48} color="#a6e67e" />
                    <Text style={styles.emptyText}>{filter === 'saved' ? 'Chưa có video đã lưu trên điện thoại này.' : filter === 'shorts' ? 'Chưa có video Shorts.' : 'Chưa có video để hiển thị.'}</Text>
                </View> : size.height > 0 && size.width > 0 && <FlatList
                    ref={list} data={visible} keyExtractor={item => item.id}
                    scrollEnabled={!fullscreen}
                    pagingEnabled snapToInterval={size.height} decelerationRate="fast" disableIntervalMomentum
                    showsVerticalScrollIndicator={false} initialNumToRender={3} maxToRenderPerBatch={3} windowSize={3}
                    removeClippedSubviews={false}
                    extraData={{ index, focused, foreground, playerVisible, saved, size }}
                    getItemLayout={(_, itemIndex) => ({ length: size.height, offset: size.height * itemIndex, index: itemIndex })}
                    onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig}
                    renderItem={({ item, index: itemIndex }) => Math.abs(itemIndex - index) <= 1 && focused
                        ? <FeedVideoCard key={item.id} video={item} width={size.width} height={size.height}
                            immersive={filter === 'shorts'}
                            playing={itemIndex === index && foreground && playerVisible} saved={saved.includes(item.id)} initialPosition={progress.current[item.id] || 0}
                            onSave={() => toggleSave(item.id)} onProgress={onProgress} onFullScreenChange={onFullScreenChange} />
                        : <View style={{ height: size.height, width: size.width, backgroundColor: '#080f18', justifyContent: 'center' }}>
                            <Image source={{ uri: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` }}
                                style={{ width: size.width, height: Math.min(size.height, size.width * 9 / 16) }} resizeMode="contain" />
                        </View>}
                />}
        </View>
        {filter !== 'shorts' && <View style={styles.footer}>
            <Pressable accessibilityRole="button" accessibilityLabel="Video trước" disabled={index === 0 || loading} onPress={() => move(-1)} style={styles.headerButton}>
                <Ionicons name="chevron-up" size={24} color={index > 0 ? '#fff' : '#435062'} />
            </Pressable>
            <Text style={styles.subtitle}>{visible.length ? `${index + 1}/${visible.length}` : 'Video từ Nha khoa Thùy Anh'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Video tiếp theo" disabled={index >= visible.length - 1 || loading} onPress={() => move(1)} style={styles.headerButton}>
                <Ionicons name="chevron-down" size={24} color={index < visible.length - 1 ? '#fff' : '#435062'} />
            </Pressable>
        </View>}
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#080f18' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5 },
    headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    heading: { flex: 1, paddingLeft: 6 },
    title: { color: '#fff', fontSize: 23, fontWeight: '700' },
    subtitle: { color: '#9baabb', fontSize: 12 },
    filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 18, paddingVertical: 10 },
    shortFilters: { paddingHorizontal: 8, paddingVertical: 0, alignItems: 'center', gap: 4 },
    chip: { backgroundColor: '#1b2735', borderRadius: 22, paddingHorizontal: 20, paddingVertical: 11 },
    selectedChip: { backgroundColor: '#a6e67e' },
    chipText: { color: '#d4deea', fontSize: 13, fontWeight: '600' },
    selectedText: { color: '#132715' },
    viewport: { flex: 1 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 },
    emptyText: { color: '#c1ccd9', textAlign: 'center', lineHeight: 22 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 },
    notice: { color: '#e6c789', fontSize: 12, paddingHorizontal: 18 },
});
