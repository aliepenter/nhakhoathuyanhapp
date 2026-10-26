import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { ACTIVITY_INTERVAL_MS, createActivityTracker } from '@/lib/appActivity';

export default function useAppActivity() {
    const pathname = usePathname();
    const trackerRef = useRef<ReturnType<typeof createActivityTracker> | null>(null);

    useEffect(() => {
        if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;
        const tracker = createActivityTracker({
            readToken: () => SecureStore.getItemAsync('Dat.2624'),
            send: (token, signal) => axios.post(`${SERVER_URI}/app-activity/heartbeat`, {
                platform: Platform.OS,
                app_version: Application.nativeApplicationVersion ?? 'unknown',
                is_development: __DEV__ || (!!Updates.channel && Updates.channel !== 'production'),
            }, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
                signal,
            }),
        });
        trackerRef.current = tracker;
        tracker.setActive(AppState.currentState === 'active');
        const listener = AppState.addEventListener('change', state => tracker.setActive(state === 'active'));
        const timer = setInterval(() => { void tracker.tick(); }, ACTIVITY_INTERVAL_MS);
        return () => {
            clearInterval(timer);
            listener.remove();
            tracker.setActive(false);
            trackerRef.current = null;
        };
    }, []);

    // Detect a newly stored login token on navigation without a second user/profile request.
    useEffect(() => { void trackerRef.current?.tick(); }, [pathname]);
}
