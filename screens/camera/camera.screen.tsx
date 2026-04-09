import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { CameraView, CameraRatio, CameraType, Camera } from 'expo-camera';
import { Image } from 'expo-image';
import { icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import PreviewScreen from './preview.screen';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { evaluateSmileGuide, GUIDE_TEXT } from '@/utils/cameraSmileRules';

type CameraScreenProps = {};

type FaceDetectorModule = typeof import('expo-face-detector');

const getFaceDetectorModule = (): FaceDetectorModule | null => {
    try {
        return require('expo-face-detector') as FaceDetectorModule;
    } catch (error) {
        return null;
    }
};

export default function CameraScreen(props: CameraScreenProps) {
    const cameraRef = React.useRef<CameraView>(null);
    const isLiveCheckingRef = React.useRef(false);
    const isCapturingRef = React.useRef(false);
    const isValidatingRef = React.useRef(false);
    const [picture, setPicture] = React.useState<string>("");
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const { statusImage, id }: any = useLocalSearchParams();
    const [ratio, setRatio] = useState<CameraRatio>('4:3');
    const [guideMessage, setGuideMessage] = useState<string>(GUIDE_TEXT.noFace);
    const [guideScore, setGuideScore] = useState<number>(0);
    const [guideStatus, setGuideStatus] = useState<'ready' | 'warning' | 'blocked'>('blocked');
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [faceDetectorReady, setFaceDetectorReady] = useState<boolean>(true);
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const canCapture = !faceDetectorReady || guideStatus === 'ready';
    const liveCheckIntervalMs = 300;

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        setFaceDetectorReady(!!getFaceDetectorModule());
    }, []);

    useEffect(() => {
        isValidatingRef.current = isValidating;
    }, [isValidating]);

    const handleBack = () => {
        router.back();
    };

    const handleGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled) {
            setPicture(result.assets[0].uri);
        }
    }

    const validateCurrentFrame = async () => {
        const detector = getFaceDetectorModule();
        if (!detector || !cameraRef.current || !isCameraReady || picture) {
            return;
        }

        if (isLiveCheckingRef.current || isValidatingRef.current || isCapturingRef.current) {
            return;
        }

        try {
            isLiveCheckingRef.current = true;
            const frame = await cameraRef.current.takePictureAsync({
                quality: 0.4,
                skipProcessing: true,
                shutterSound: false,
            });

            const detection = await detector.detectFacesAsync(frame.uri, {
                mode: detector.FaceDetectorMode.fast,
                detectLandmarks: detector.FaceDetectorLandmarks.none,
                runClassifications: detector.FaceDetectorClassifications.all,
            });

            const result = evaluateSmileGuide(
                detection.faces,
                { width: frame.width, height: frame.height },
                facing === 'front',
                { isAndroid: Platform.OS === 'android' }
            );

            setGuideMessage(result.reason);
            setGuideScore(result.score);
            setGuideStatus(result.status);
        } catch (error) {
            // Keep silent in live-check mode to avoid noisy logs/toasts.
        } finally {
            isLiveCheckingRef.current = false;
        }
    };

    useEffect(() => {
        if (!hasPermission || !isCameraReady || !faceDetectorReady || picture) {
            return;
        }

        const intervalId = setInterval(() => {
            void validateCurrentFrame();
        }, liveCheckIntervalMs);

        return () => {
            clearInterval(intervalId);
        };
    }, [hasPermission, isCameraReady, faceDetectorReady, picture, facing, liveCheckIntervalMs]);

    const takePicture = async () => {
        if (cameraRef.current && isCameraReady && !isValidating) {
            try {
                isCapturingRef.current = true;

                // Avoid concurrent takePictureAsync calls from live-check and manual capture.
                let waitCount = 0;
                while (isLiveCheckingRef.current && waitCount < 10) {
                    await new Promise((resolve) => setTimeout(resolve, 40));
                    waitCount += 1;
                }

                if (faceDetectorReady && !canCapture) {
                    Toast.show({
                        type: 'info',
                        text1: 'Ảnh chưa đạt',
                        text2: guideMessage,
                    });
                    return;
                }

                setIsValidating(true);
                const res = await cameraRef.current.takePictureAsync({
                    quality: 1,
                });

                const detector = getFaceDetectorModule();
                if (!detector) {
                    setFaceDetectorReady(false);
                    setPicture(res.uri);
                    Toast.show({
                        type: 'info',
                        text1: 'Đang ở chế độ chụp thủ công',
                        text2: 'Face detector chưa sẵn sàng trên bản build này',
                    });
                    return;
                }

                const detection = await detector.detectFacesAsync(res.uri, {
                    mode: detector.FaceDetectorMode.fast,
                    detectLandmarks: detector.FaceDetectorLandmarks.all,
                    runClassifications: detector.FaceDetectorClassifications.all,
                });

                const result = evaluateSmileGuide(
                    detection.faces,
                    { width: res.width, height: res.height },
                    facing === 'front',
                    { isAndroid: Platform.OS === 'android' }
                );

                setGuideMessage(result.reason);
                setGuideScore(result.score);
                setGuideStatus(result.status);

                if (result.ok) {
                    setPicture(res.uri);
                    return;
                }

                Toast.show({
                    type: 'info',
                    text1: 'Ảnh chưa đạt',
                    text2: result.reason,
                });
            } catch (error) {
                console.error('Error taking picture:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Không thể chụp ảnh',
                    text2: 'Vui lòng thử lại',
                });
            } finally {
                isCapturingRef.current = false;
                setIsValidating(false);
            }
        }
    }

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    if (picture) {
        return <PreviewScreen picture={picture} setPicture={setPicture} status={statusImage} id={id} />
    }

    if (hasPermission === null) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Đang yêu cầu quyền camera...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Không có quyền truy cập camera</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(0,0,0,0.8)',
                alignItems: 'center',
                justifyContent: 'center',
                height: 112,
                width: '100%',
                position: 'absolute',
                top: 0,
                zIndex: 10,
            }}>
                <View style={{ width: '15%', height: '60%', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity 
                        style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50 }}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '70%', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Chụp ảnh</Text>
                </View>
                <View style={{ width: '15%', height: '60%', alignItems: 'center', justifyContent: 'flex-end' }}></View>
            </View>

            {/* Camera with overlay */}
            <View style={{ flex: 1, position: 'relative' }}>
                {hasPermission && (
                    <CameraView
                        mute={true}
                        animateShutter={Platform.OS !== 'android'}
                        zoom={0}
                        ref={cameraRef}
                        mode="picture"
                        facing={facing}
                        style={{
                            width: screenWidth,
                            height: screenHeight,
                        }}
                        ratio={ratio}
                        onCameraReady={onCameraReady}
                    />
                )}

                <View
                    pointerEvents='none'
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: Math.min(screenWidth * 0.68, 300),
                            height: Math.min(screenWidth * 0.82, 360),
                            marginTop: -36,
                            borderRadius: 220,
                            borderWidth: 5,
                            borderColor: guideStatus === 'ready' ? '#21D07A' : guideStatus === 'warning' ? '#42A5F5' : '#E54660',
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ position: 'absolute', height: 1.5, width: '100%', backgroundColor: 'rgba(255,255,255,0.55)' }} />
                        <View style={{ position: 'absolute', width: 1.5, height: '100%', backgroundColor: 'rgba(255,255,255,0.55)' }} />
                    </View>
                </View>
            </View>

            {/* Bottom controls */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                backgroundColor: 'rgba(0,0,0,0.8)',
                alignItems: 'center',
                height: 196,
                width: '100%',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
            }}>
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        paddingVertical: 8,
                        backgroundColor: guideStatus === 'ready' ? '#21D07A' : guideStatus === 'warning' ? '#42A5F5' : '#E54660',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{guideMessage}</Text>
                    <Text style={{ color: 'white', fontSize: 12, marginTop: 2 }}>Độ phù hợp: {guideScore}%</Text>
                </View>

                    {!faceDetectorReady && (
                        <View style={{
                            position: 'absolute',
                            top: 20,
                            left: 16,
                            right: 16,
                            backgroundColor: 'rgba(229, 70, 96, 0.85)',
                            borderRadius: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                        }}>
                            <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>
                                Face detector chưa được native build. App đang cho chụp thủ công.
                            </Text>
                        </View>
                    )}

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TouchableOpacity 
                        style={{ width: 60, height: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleGallery}
                    >
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity 
                        style={{ width: 70, height: 70 }}
                        onPress={takePicture}
                        disabled={!isCameraReady || isValidating || !canCapture}
                    >
                        <View style={{
                            backgroundColor: 'white',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            opacity: isCameraReady && !isValidating && canCapture ? 1 : 0.5,
                        }}>
                            <View style={{
                                backgroundColor: 'black',
                                width: '90%',
                                height: '90%',
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: '90%',
                                    borderRadius: 50,
                                }}></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}></View>
            </View>
        </View>
    );
}
