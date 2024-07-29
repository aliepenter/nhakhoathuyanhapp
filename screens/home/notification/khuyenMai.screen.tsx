import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOnlySale, getOnlyPosts, getBanners } from '@/lib/apiCall';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { Image } from 'expo-image';
import { SERVER_URL } from '@/utils/uri';
import BannerSlide from '@/components/common/BannerSlide';

export default function KhuyenMaiScreen() {
  const [banners, setBanners] = useState([]);
  const [salePosts, setSalePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchSalePosts();
    await fetchBannerData();
    setRefreshing(false);
  };
  const handleTruncate = (title: string) => {
    const truncatedTitle = title && title.length > 80 ? `${title.slice(0, 80)}...` : title;
    return truncatedTitle;
  }
  useEffect(() => {
    fetchBannerData();
    fetchSalePosts();
  }, []);
  const fetchSalePosts = async () => {
    try {
      const salePostsData = await getOnlyPosts();
      setTimeout(() => {
        if (salePostsData) {
          setSalePosts(salePostsData.data);
          setLoading(false)
        } else {
          setLoading(false)
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  };
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
  const onPress = (item: any) => {
    if (item) {
      setFlag(true);
      router.push({
        pathname: "(routes)/tin-tuc/tinTucDetail",
        params: { postThumb: item.banner_id.banner_path, postTime: item.date, postTitle: item.title, postContent: item.content, postUrl: item.website_url },
      });
      setTimeout(() => {
        setFlag(false)
      }, 1000);
    }
  }
  return (
    <View className="bg-white">
      <FlatList
        data={[{ key: 'banner' }, { key: 'branches' }]}
        renderItem={({ item }) => {
          switch (item.key) {
            case 'banner':
              return <BannerSlide banners={banners} type={4} />;
            case 'branches':
              return (<ScrollView className='bg-white flex-1' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className='px-[17px]'>
                  {!loading
                    ?
                    salePosts && salePosts.length != 0
                      ?
                      salePosts.map((item: Post, index: number) => {
                        const isLastItem = index === salePosts.length - 1;
                        return (
                          <TouchableOpacity disabled={flag} key={index} onPress={() => onPress(item)}
                            className={`flex-row my-[7px] mt-[14px] rounded-[7px] bg-[#F5F5F5] p-[10px] ${isLastItem ? 'mb-28' : ''}`} style={styles.boxShadow}>
                            <View className='w-[15%] justify-center items-start'>
                              <Image
                                transition={500}
                                contentFit='cover'
                                source={{ uri: `${SERVER_URL}${item.banner_id.banner_path}` }}
                                className="h-[42px] w-[42px] rounded-full"
                              />
                            </View>
                            <View className='w-[85%]'>
                              <View className={`flex-row items-center justify-center flex-wrap`}>
                                <View className='w-[80%] items-start'>
                                  <Text className={`text-[#51B81A] font-pbold text-[14px]`}>{item.title}</Text>
                                </View>
                                <View className='w-[20%] items-end'>
                                  <Text className='text-[#6C6C6C] font-pmedium text-[10px]'>1ph trước</Text>
                                </View>
                              </View>
                              <View className={`flex-row items-center justify-start flex-wrap`}>
                                <View className='w-[95%]'>
                                  <Text className='font-pregular text-[12px]'>{handleTruncate(item.content)}</Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      }
                      )
                      :
                      <View className='justify-center items-center h-96'>
                        <Text>Không có dữ liệu trò chuyện</Text>
                      </View>
                    :
                    <View className="h-64 justify-center">
                      <ActivityIndicator />
                    </View>
                  }

                </View>
              </ScrollView>);
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

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  }
});