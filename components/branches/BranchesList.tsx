import {
    ActivityIndicator,
    Image,
    Text,
    View,
    Linking,
    Alert
} from "react-native";
import React, { useCallback } from "react";
import { SERVER_URL } from "@/utils/uri";
import CustomButton from '@/components/common/CustomButton';
import icons from "@/constants/icons";

export default function BranchList({ branches }: any) {
    const groupedBranches: { [key: string]: any[] } = {};

    branches.forEach((branch: any) => {
        if (!groupedBranches[branch.tinh_thanh]) {
            groupedBranches[branch.tinh_thanh] = [];
        }
        groupedBranches[branch.tinh_thanh].push(branch);
    });

    const handlePress = useCallback(async (url: any) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Không thể mở đường dẫn: ${url}`);
        }
    }, []);

    return (
        // <View className="pl-[11px] pr-[11px]">
        //     {Object.keys(groupedBranches).length !== 0 ? (
        //         Object.keys(groupedBranches).map((city: string, index: number) => (
        //             <View key={index} className=" justify-center items-center">
        //                 <Text className="font-pbold text-[16px] text-[#5EBA1B]">
        //                     {city}
        //                 </Text>
        //                 {groupedBranches[city].map((item: any, idx: number) => (
        //                     <BranchItemDetail
        //                         key={idx}
        //                         index={idx}
        //                         item={item}
        //                         handlePress={handlePress}
        //                         branches={groupedBranches[city]}
        //                     />
        //                 ))}
        //             </View>
        //         ))
        //     ) : (
        //         <View className="bg-[#FAFAFA] h-[500px] justify-center">
        //             <ActivityIndicator />
        //         </View>
        //     )}
        // </View>
        <View className="pl-[11px] pr-[11px]">
            {branches.length != 0
                ?
                branches.map((item: Branch, index: number) => (
                    <BranchItemDetail
                        key={index}
                        index={index}
                        item={item}
                        handlePress={handlePress}
                        branches={branches}
                    />
                ))
                :
                <View className="bg-[#FAFAFA] h-[500px] justify-center">
                    <ActivityIndicator />
                </View>
            }

        </View>
    );
}

const BranchItemDetail = ({ index, item, handlePress, branches }: any) => {
    return (
        <View className={`${index + 1 !== branches.length ? 'border-b-[1px] border-[#E9E9E9]' : ''} flex-row items-center pb-[16px] mb-[16px]`}>
            <View>
                <Image source={{ uri: `${SERVER_URL}${item.image_url}` }} resizeMode='contain' className='w-[95px] h-[84px]' />
            </View>
            <View className="ml-[15px] w-[72%]">
                <View>
                    <Text className="font-pbold text-[16px] text-[#5EBA1B]">{item.ten_chi_nhanh}</Text>
                    <Text className="text-[12px]">{item.dia_chi}</Text>
                </View>
                <View className="flex-row mt-[10px]">
                    <CustomButton
                        title="Liên hệ"
                        handlePress={() => handlePress(`tel:${item.phone_number}`)}
                        containerStyles="mr-[12px]"
                        icon={icons.phoneBlack}
                        buttonStyle="rounded-full py-[5px] px-[19px] bg-[#EDEDED] border-[#D7D7D7] border-[1px]"
                        textStyles="font-pregular text-[12px]"
                        iconStyle="w-[19px] h-[19px] mr-[6px]"
                    />
                    <CustomButton
                        title="Chỉ đường"
                        handlePress={() => handlePress(item.map_url)}
                        icon={icons.map}
                        buttonStyle="rounded-full py-[5px] px-[10px]"
                        colorFrom="#1361AA"
                        colorTo="#5EBA1B"
                        textStyles="text-white font-pregular text-[12px]"
                        iconStyle="w-[19px] h-[15px] mr-[6px]"
                    />
                </View>
            </View>
        </View>
    );
}
