import { useState } from 'react';
import useUser from '@/hooks/auth/useUser';
import { getLichSuTroChuyen } from '@/lib/apiCall';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

const useUnseenMessages = () => {
    const { user } = useUser();
    const [unseenCount, setUnseenCount] = useState(0);
    const [refetch, setRefetch] = useState(Date.now()); // Initialize with current timestamp

    useFocusEffect(
        React.useCallback(() => {
            const fetchMessages = async () => {
                if (user && user.id) {
                    const userId = user.id;
                    try {
                        const data = await getLichSuTroChuyen(userId);
                        const unseenMessages = data?.data.filter((item: { seen: number; }) => item.seen === 0);
                        setUnseenCount(unseenMessages.length);
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                    }
                }
            };
            fetchMessages();
        }, [user, refetch])
    );

    return { unseenCount, setRefetch };
};

export default useUnseenMessages;