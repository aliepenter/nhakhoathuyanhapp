import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import YoutubePlayer, { PLAYER_STATES, YoutubeIframeRef } from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { FeedVideo } from '@/utils/youtube';

// Resize the outer embed container, preserving the complete YouTube player and controls.
const fitEmbed = `var style=document.createElement('style');style.textContent='html,body{height:100%;background:#080f18}.container{height:100vh!important;padding-bottom:0!important}';document.head.appendChild(style);true;`;
const darkBeforeLoad = `if(document.documentElement){document.documentElement.style.backgroundColor='#080f18';}document.addEventListener('DOMContentLoaded',function(){document.body.style.backgroundColor='#080f18';});true;`;

type Props = {
    video: FeedVideo; width: number; height: number; playing: boolean;
    saved: boolean; initialPosition: number; onSave: () => void;
    immersive?: boolean;
    onProgress: (id: string, seconds: number) => void;
    onFullScreenChange: (fullscreen: boolean) => void;
};

export default function FeedVideoCard({ video, width, height, playing, saved, initialPosition, onSave, onProgress, onFullScreenChange, immersive = false }: Props) {
    const player = useRef<YoutubeIframeRef | null>(null);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);
    const [retry, setRetry] = useState(0);
    const [state, setState] = useState('unstarted');
    const start = useRef(video.isShort ? 0 : initialPosition);
    const requestPending = useRef(false);
    const playerHeight = immersive ? Math.max(200, height)
        : Math.max(200, Math.min(height - 165, video.isShort ? width * 16 / 9 : width * 9 / 16));

    useEffect(() => {
        if (ready || failed) return;
        const timer = setTimeout(() => setFailed(true), 20000);
        return () => clearTimeout(timer);
    }, [ready, failed, retry]);

    useEffect(() => {
        if (!ready || !playing || video.isShort || state !== 'playing') return;
        let mounted = true;
        const timer = setInterval(async () => {
            if (requestPending.current || !player.current) return;
            requestPending.current = true;
            try {
                const seconds = await player.current.getCurrentTime();
                if (mounted && Number.isFinite(seconds)) onProgress(video.id, seconds);
            } catch { /* Playback continues when progress cannot be read. */ }
            finally { requestPending.current = false; }
        }, 5000);
        return () => { mounted = false; clearInterval(timer); };
    }, [ready, playing, video.id, video.isShort, state, onProgress]);

    const openYoutube = async () => {
        try { await Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`); }
        catch { setFailed(true); }
    };

    return <View style={[styles.page, { width, height }]}>
        <View style={styles.playerArea}>
            {failed ? <View style={styles.error}>
                <Ionicons name="videocam-off-outline" size={34} color="#9baabb" />
                <Text style={styles.help}>Video chưa tải được hoặc không cho phép phát trong App.</Text>
                <Pressable accessibilityRole="button" onPress={() => { setFailed(false); setReady(false); setRetry(value => value + 1); }} style={styles.retry}>
                    <Text style={styles.actionText}>Thử lại</Text>
                </Pressable>
            </View> : <YoutubePlayer
                key={`${video.id}-${retry}`} ref={player} videoId={video.id}
                height={playerHeight} width={width} play={playing} mute={!playing}
                webViewStyle={{ backgroundColor: '#080f18' }}
                initialPlayerParams={{ controls: true, rel: false, start: start.current }}
                webViewProps={{ scrollEnabled: false, injectedJavaScript: fitEmbed,
                    injectedJavaScriptBeforeContentLoaded: darkBeforeLoad,
                    onError: () => setFailed(true), onHttpError: () => setFailed(true) }}
                onReady={() => setReady(true)} onError={() => setFailed(true)}
                onFullScreenChange={onFullScreenChange}
                onChangeState={next => {
                    setState(next);
                    if (next === PLAYER_STATES.ENDED) onProgress(video.id, 0);
                }}
            />}
        </View>
        {!immersive && <View style={styles.details}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{video.isShort ? 'YOUTUBE SHORTS' : 'YOUTUBE VIDEO'}</Text>
                {!ready && !failed && <ActivityIndicator size="small" color="#9bdf6a" />}
            </View>
            <Text numberOfLines={2} style={styles.title}>{video.title}</Text>
            <View style={styles.actions}>
                <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Bỏ lưu video' : 'Lưu video'} onPress={onSave} style={styles.action}>
                    <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={21} color={saved ? '#a6e67e' : '#fff'} />
                    <Text style={styles.actionText}>{saved ? 'Đã lưu' : 'Lưu video'}</Text>
                </Pressable>
                <Pressable accessibilityRole="link" onPress={openYoutube} style={styles.action}>
                    <Ionicons name="logo-youtube" size={22} color="#fff" /><Text style={styles.actionText}>Mở YouTube</Text>
                </Pressable>
            </View>
        </View>}
    </View>;
}

const styles = StyleSheet.create({
    page: { backgroundColor: '#080f18' },
    playerArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    details: { paddingHorizontal: 18, paddingVertical: 12, minHeight: 145 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    label: { color: '#a6e67e', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
    title: { color: '#fff', fontSize: 17, fontWeight: '600', marginTop: 6 },
    actions: { flexDirection: 'row', gap: 20, marginTop: 10 },
    action: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 40 },
    actionText: { color: '#fff', fontSize: 13 },
    help: { color: '#c1ccd9', textAlign: 'center', lineHeight: 22 },
    error: { padding: 24, gap: 16, alignItems: 'center' },
    retry: { backgroundColor: '#21422c', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
});
