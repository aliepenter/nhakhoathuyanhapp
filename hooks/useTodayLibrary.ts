import { useState } from 'react';
import { getCustomerLibrary } from '@/lib/apiCall'; // Giả sử bạn đã có hàm này
import useUser from '@/hooks/auth/useUser';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { checkTodayIsShoot } from '@/lib/commonFunctions';

const useLibrary = () => {
    const { user } = useUser(); // Giả sử bạn đã có hook này để lấy thông tin người dùng
    const [library, setLibrary] = useState([]); // State để lưu trữ danh sách thư viện
    const [refetch, setRefetch] = useState(Date.now()); // State để trigger lại fetch khi cần thiết
    const [hasImage, setHasImage] = useState(false);

    // Hàm fetchCustomerLibrary
    const fetchCustomerLibrary = async (userId: number) => {
        try {
            const customerLibrary = await getCustomerLibrary(userId);
            setLibrary(customerLibrary?.data || []); // Cập nhật state library với dữ liệu trả về
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Sử dụng useFocusEffect để gọi hàm fetch khi component được focus
    useFocusEffect(
        React.useCallback(() => {
            if (user && user.id) {
                fetchCustomerLibrary(user.id);
                const todayImageData = checkTodayIsShoot(library);
                if (todayImageData) {
                    setHasImage(true);
                } else {
                    setHasImage(false);
                } // Gọi hàm fetch khi có user.id
            }
        }, [user, refetch]) // Khi user hoặc refetch thay đổi, sẽ gọi lại fetchCustomerLibrary
    );

    return { library, hasImage, setRefetch }; // Trả về các giá trị cần thiết từ hook
};

export default useLibrary;
