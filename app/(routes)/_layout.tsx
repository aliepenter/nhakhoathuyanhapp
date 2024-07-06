import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '@/components/common/CustomHeader';

const PageLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="branches/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} title="Các chi nhánh" />
                        ),
                    }}
                />
                <Stack.Screen options={{ headerShown: false }} name="login/index" />
                <Stack.Screen options={{ headerShown: false }} name="verify-password/index" />
                <Stack.Screen options={{ headerShown: false }} name="verify-password/otpLogin" />
                <Stack.Screen options={{ headerShown: false }} name="verify-sign-up/index" />
                <Stack.Screen options={{
                    header: (props) => (
                        <CustomHeader {...props} title="Các chi nhánh" />
                    ),
                }} name="play-video/index" />
            </Stack>
        </>
    );
};

export default PageLayout;
