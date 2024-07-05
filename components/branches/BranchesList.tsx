import {
    ActivityIndicator,
    Image,
    Text,
    View,
} from "react-native";
import React from "react";
import { SERVER_URL } from "@/utils/uri";
import CustomButton from '@/components/common/CustomButton';
import icons from "@/constants/icons";

export default function BranchList({ branches }: any) {
    return (
        <View className="pl-[11px] pr-[11px]">
            {branches.length != 0
                ?
                branches.map((item: Branch, index: number) => (
                    <View key={index} className={`${index + 1 !== branches.length ? 'border-b-[1px] border-[#E9E9E9]' : ''} flex-row items-center pb-[16px] mb-[16px]`}>
                        <View>
                            <Image source={{ uri: `${SERVER_URL}${item.image_url}` }} resizeMode='contain' className='w-[95px] h-[84px]' />
                        </View>
                        <View className="ml-[15px] w-[72%]">
                            <View>
                                <Text className="font-pbold text-[16px] text-[#5EBA1B]">{item.ten_chi_nhanh}</Text>
                                <Text className="text-[12px]">{item.dia_chi}</Text>
                            </View>
                            <View className="flex-row">
                                <CustomButton
                                    title="Liên hệ"
                                    handlePress={() => { }}
                                    containerStyles=""
                                    icon={icons.phoneBlack}
                                    buttonStyle="rounded-full p-[5px]"
                                    colorFrom="#2594B8"
                                    colorTo="#226E9E"
                                    textStyles="text-white font-psemibold text-lg"
                                    iconStyle="w-[19px] h-[19px]"
                                />
                                <CustomButton
                                    title="Chỉ đường"
                                    handlePress={() => { }}
                                    icon={icons.map}
                                    buttonStyle="rounded-full p-[5px]"
                                    colorFrom="#1361AA"
                                    colorTo="#5EBA1B"
                                    textStyles="text-white font-psemibold text-lg"
                                    iconStyle="w-[25px] h-[19px]"
                                />
                            </View>
                        </View>
                    </View>
                ))
                :
                <View className="bg-[#FAFAFA] h-[500px] justify-center">
                    <ActivityIndicator />
                </View>
            }

        </View>

    )
}