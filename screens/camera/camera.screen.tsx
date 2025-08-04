import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { CameraView, CameraRatio, CameraType, Camera } from 'expo-camera';
import { Image } from 'expo-image';
import { icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import PreviewScreen from './preview.screen';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

type CameraScreenProps = {};

export default function CameraScreen(props: CameraScreenProps) {
    const cameraRef = React.useRef<CameraView>(null);
    const [picture, setPicture] = React.useState<string>("");
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const { statusImage, id }: any = useLocalSearchParams();
    const [ratio, setRatio] = useState<CameraRatio>('4:3');
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

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

    const takePicture = async () => {
        if (cameraRef.current && isCameraReady) {
            try {
                const res = await cameraRef.current.takePictureAsync({
                    quality: 1,
                });
                setPicture(res.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
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
            </View>

            {/* Bottom controls */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                backgroundColor: 'rgba(0,0,0,0.8)',
                alignItems: 'center',
                height: 160,
                width: '100%',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
            }}>
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
                        disabled={!isCameraReady}
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
                            opacity: isCameraReady ? 1 : 0.5,
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
