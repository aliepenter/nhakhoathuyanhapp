import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
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
  const handleCamera = async () => {
    setFlag(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      if (result.assets[0].uri && avatar?.id) {
        const fileName = `${user.id}_${user.so_dien_thoai}_${formatDate(user.ngay_sinh, "path")}.jpg`;
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
            value: `img/uploads/avatar/${fileName}?timestamp=${Date.now()}`,
          };

          try {
            await updateAvatar(avatar.id, anh);
            setRefetch(Date.now());
            Toast.show({
              position: 'bottom',
              type: "success",
              text1: "Thành công",
              text2: "Thay đổi ảnh đại diện thành công",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Đã có lỗi xảy ra, xin thử lại sau",
            });
          }
        } catch (error) {
          Toast.show({
            type: "info",
            text1: "Ứng dụng chưa sẵn sàng",
            text2: "Vui lòng thay thế ảnh sau vài giây",
          });
          console.error("Error uploading file:", error);
        }
      }
    }
    setTimeout(() => {
      setFlag(false);
    }, 1000);
  };
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
                <View className="h-[100px] w-[100px] bg-gray-500 rounded-full justify-center items-center">
                  {
                    !disable ? (
                      <Image
                        source={{ uri: `${SERVER_URL}${avatar.value}` }}
                        resizeMode="contain"
                        alt="avatar"
                        fadeDuration={0.5}
                        className="rounded-full w-full h-full"
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
              <TouchableOpacity disabled={flag == true ? true : disableChange == false ? false : true} onPress={handleCamera}>
                <View className={`absolute bg-black bottom-[5px] right-[5px] rounded-[50px] w-[20px] h-[20px] justify-center items-center ${!disableChange ? "" : "opacity-30"}`}>
                  <Image
                    source={icons.edit}
                    resizeMode="contain"
                    className="w-[60%] h-[60%]"
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <View className="ml-4">
            <View className="flex-row items-center w-[70%]">
              <Text className="text-white text-[14px] md:text-[18px]">
                Xin chào,{" "}
              </Text>
              <Text className="text-white text-[14px] md:text-[18px] font-pbold">
                {user?.ho_va_ten}
              </Text>
            </View>
            <View className="flex-col w-[80%]">
              <Text className="text-white text-[14px] md:text-[18px] font-pbold my-1">
                {user?.so_dien_thoai}
              </Text>
              <Text className="text-white text-[14px] md:text-[18px] font-semibold">
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
