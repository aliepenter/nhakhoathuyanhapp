import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import * as ImagePicker from "expo-image-picker";

import { SERVER_URI, SERVER_URL } from "@/utils/uri";
import { updateAvatar } from "@/lib/apiCall";
import { formatDate, getToday } from "@/lib/commonFunctions";
import axios from "axios";
import Toast from "react-native-toast-message";

type HeaderSectionProps = {
  showNotification: boolean;
  editAvatar: boolean;
  avatar: any;
  loading: boolean;
  disable: boolean;
  disableChange: boolean;
  flag: boolean;
  user: any;
  setRefetch: (index: number) => void;
  setFlag: (index: boolean) => void;
  customBgColor: string;
};

export default function HeaderSection({
  disable,
  disableChange,
  user,
  loading,
  avatar,
  showNotification,
  editAvatar,
  setFlag,
  flag,
  setRefetch,
  customBgColor,
}: HeaderSectionProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  const handleCamera = async () => {
    if (uploadingAvatar) return; // Prevent multiple uploads
    
    setFlag(true);
    setUploadingAvatar(true);
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled && result.assets[0].uri && avatar?.id) {
        const fileName = `${user.id}_${user.so_dien_thoai}_${formatDate(user.ngay_sinh, "path")}.jpg`;
        const timestamp = Date.now();
        
        // Show local image immediately
        setLocalAvatarUrl(result.assets[0].uri);
        
        try {
          const formData = new FormData();
          formData.append("file", {
            uri: result.assets[0].uri,
            type: "image/jpeg",
            name: fileName,
          } as any);
          
          await axios.post(`${SERVER_URI}/file/upload-avatar`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          const anh: any = {
            value: `img/uploads/avatar/${fileName}?v=${timestamp}`,
          };

          await updateAvatar(avatar.id, anh);
          
          // Update local state with new server URL
          setLocalAvatarUrl(`${SERVER_URL}${anh.value}`);
          
          // Trigger refetch after a short delay to ensure server has processed
          setTimeout(() => {
            setRefetch(timestamp);
          }, 500);
          
          Toast.show({
            position: 'bottom',
            type: "success",
            text1: "Thành công",
            text2: "Thay đổi ảnh đại diện thành công",
          });
          
        } catch (error) {
          console.error("Error uploading avatar:", error);
          Toast.show({
            type: "error",
            text1: "Lỗi upload",
            text2: "Không thể tải ảnh lên server",
          });
          // Reset local avatar on error
          setLocalAvatarUrl(null);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể chọn ảnh",
      });
    } finally {
      setUploadingAvatar(false);
      setTimeout(() => {
        setFlag(false);
      }, 1000);
    }
  };

  // Determine which avatar URL to show
  const getAvatarUrl = () => {
    if (localAvatarUrl) {
      return localAvatarUrl;
    }
    if (avatar?.value) {
      return `${SERVER_URL}${avatar.value}`;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <View className={`${customBgColor} h-[150px]`}>
      <ImageBackground
        source={images.bgHeaderPage}
        resizeMode="stretch"
        className="flex-1"
      >
        <View className="flex-row flex-1 justify-start ml-7 mt-8 items-center">
          <View>
            {!loading ? (
              avatar ? (
                <View className="h-[70px] w-[70px] bg-gray-500 rounded-full justify-center items-center">
                  {
                    !disable && !uploadingAvatar ? (
                      <Image
                        source={avatarUrl ? { uri: avatarUrl } : undefined}
                        resizeMode="contain"
                        alt="avatar"
                        fadeDuration={0.3}
                        className="rounded-full w-full h-full"
                        onError={() => {
                          console.log("Avatar image failed to load");
                          setLocalAvatarUrl(null);
                        }}
                      />
                    ) : (
                      <ActivityIndicator color={'#00E5E5'} />
                    )
                  }
                </View>
              ) : (
                <View className="h-[100px] w-[100px] bg-gray-500 rounded-full justify-center items-center">
                  <ActivityIndicator color={'#00E5E5'} />
                </View>
              )
            ) : (
              <View className="h-[100px] w-[100px] bg-gray-500 rounded-full justify-center items-center">
                <ActivityIndicator color={'#00E5E5'} />
              </View>
            )}
            {editAvatar ? (
              <TouchableOpacity 
                disabled={flag || uploadingAvatar || disableChange} 
                onPress={handleCamera}
              >
                <View className={`absolute bg-black bottom-[0px] right-[0px] rounded-[50px] w-[20px] h-[20px] justify-center items-center ${!disableChange && !uploadingAvatar ? "" : "opacity-30"}`}>
                  <Image
                    source={icons.edit}
                    resizeMode="contain"
                    className="w-[60%] h-[60%]"
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <View className="ml-4 flex-1">
            <View className="flex-row items-center flex-wrap">
              <Text className="text-white text-[14px] md:text-[18px]">
                Xin chào,{" "}
              </Text>
              <Text className="text-white text-[14px] md:text-[18px] font-pbold flex-1" numberOfLines={1}>
                {user?.ho_va_ten}
              </Text>
            </View>
            <View className="flex-col">
              <Text className="text-white text-[14px] md:text-[18px] font-pbold my-1" numberOfLines={1}>
                {user?.so_dien_thoai}
              </Text>
              <Text className="text-white text-[14px] md:text-[18px] font-semibold" numberOfLines={2}>
                {user?.dia_chi}
              </Text>
            </View>
          </View>
        </View>
        {showNotification ? (
          <View className="absolute top-[30%] right-6 md:top-[35%] md:right-12">
            <Image
              source={icons.notificationHeader}
              resizeMode="contain"
              className="w-[20px] h-[21px] md:w-[30px] md:h-[31px]"
            />
            <Image
              source={icons.notificationHighlight}
              resizeMode="contain"
              className="w-[14px] h-[14px] absolute left-2 bottom-3 md:left-4 md:bottom-5"
            />
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}
