import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '@/components/common/CustomHeader';
import { StatusBar } from 'react-native';

const PageLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="chinh-nha/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Lịch sử chỉnh nha" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="dat-lich/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Đặt lịch" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="lich-hen/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Lịch hẹn" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="payment/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Thanh toán" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="branches/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Các chi nhánh" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="tin-tuc/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Tin tức" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="hop-dong/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Hợp đồng" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="loi-dan/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Lời dặn" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="profile/privacy"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Điều kiện và điều khoản" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="profile/faq"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Câu hỏi thường gặp" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="profile/aboutUs"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Về chúng tôi" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="profile/changePassword"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Thay đổi mật khẩu" />
                        ),
                    }}
                />
                <Stack.Screen
                    name="profile/notificationSettings"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Cài đặt thông báo" />
                        ),
                    }}
                />
                 <Stack.Screen
                    name="tin-tuc/tinTucDetail"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Tin tức" />
                        ),
                    }}
                />
                <Stack.Screen options={{ headerShown: false }} name="login/index" />
                <Stack.Screen options={{ headerShown: false }} name="verify-password/index" />
                <Stack.Screen options={{ headerShown: false }} name="verify-password/otpLogin" />
                <Stack.Screen options={{ headerShown: false }} name="verify-sign-up/index" />
                <Stack.Screen options={{ headerShown: false }} name="play-video/index" />
                <Stack.Screen options={{ headerShown: false }} name="chinh-nha/chinhNhaDetail" />
                <Stack.Screen options={{ headerShown: false }} name="image-gallery/index" />
            </Stack>
            <StatusBar barStyle={'light-content'} />
        </>
    );
};

export default PageLayout;
