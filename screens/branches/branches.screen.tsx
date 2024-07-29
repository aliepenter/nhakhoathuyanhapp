import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import BannerSlide from '@/components/common/BannerSlide';
import { getBanners, getBranches } from '@/lib/apiCall';
import BranchList from '@/components/branches/BranchesList';

export default function BranchesScreen() {
    const [banners, setBanners] = useState([]);
    const [branches, setBranches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        setBanners([]);
        await fetchBannerData();
        setRefreshing(false);
    };
    useEffect(() => {
        fetchBannerData();
        fetchBranchesData();
    }, []);

    const fetchBannerData = async () => {
        try {
            const bannersResponse = await getBanners();
            setTimeout(() => {
                if (bannersResponse.data) {
                    setBanners(bannersResponse.data);
                }
            }, 1000);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchBranchesData = async () => {
        try {
            const branchesResponse = await getBranches();
            setTimeout(() => {
                if (branchesResponse.data) {
                    setBranches(branchesResponse.data);
                }
            }, 1000);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return (
        <View className="bg-white">
            <FlatList
                data={[{ key: 'banner' }, { key: 'branches' }]}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'banner':
                            return <BannerSlide banners={banners} type={4} />;
                        case 'branches':
                            return <BranchList branches={branches} />;
                        default:
                            return null;
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    )
}