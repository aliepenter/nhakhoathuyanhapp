import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SERVER_URL } from '@/utils/uri';
import ImageViewer from 'react-native-image-zoom-viewer';
import { icons } from '@/constants';
import { formatDate } from '@/lib/commonFunctions';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuaTrinhImage({ anh, order, expanded }: any) {
    const imageItems = [
        anh?.anh_7,
        anh?.anh_6,
        anh?.anh_11,
        anh?.anh_8,
        anh?.anh_13,
        anh?.anh_12,
        anh?.anh_1,
        anh?.anh_9,
        anh?.anh_10,
        anh?.anh_2,
        anh?.anh_3,
        anh?.anh_4,
        anh?.anh_5,
    ].filter(Boolean);
    const gallery = imageItems.map((item) => ({ url: `${SERVER_URL}${item}`, props: {} }));
    const featuredImage = imageItems[0];
    const gridRows = imageItems.slice(1).reduce((rows: any[][], item, index) => {
        if (index % 2 === 0) rows.push([item]);
        else rows[rows.length - 1].push(item);
        return rows;
    }, []);

    return (
        <View style={[styles.section, expanded && styles.expandedSection]}>
            <SectionTitle
                order={order}
                icon="image-multiple-outline"
                title="Ảnh quá trình"
                subtitle={expanded ? `${imageItems.length} ảnh trong buổi điều trị này` : anh?.ngay_chup ? `Chụp ngày ${formatDate(anh?.ngay_chup, "minimize")}` : `${imageItems.length} ảnh`}
            />
            {expanded ? (
                <View style={styles.albumWrap}>
                    <ImageItem
                        imagePath={featuredImage}
                        gallery={gallery}
                        index={0}
                        style={styles.featuredImageShell}
                    />
                    {gridRows.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.gridRow}>
                            {row.map((item, itemIndex) => {
                                const imageIndex = rowIndex * 2 + itemIndex + 1;
                                return (
                                    <ImageItem
                                        key={`${item}-${imageIndex}`}
                                        imagePath={item}
                                        gallery={gallery}
                                        index={imageIndex}
                                        style={[
                                            styles.gridImageShell,
                                            itemIndex === 0 && row.length === 2 ? styles.gridImageLeft : null,
                                            itemIndex === 1 ? styles.gridImageRight : null,
                                        ]}
                                    />
                                )
                            })}
                            {row.length === 1 && <View style={styles.gridImagePlaceholder} />}
                        </View>
                    ))}
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContent}>
                    {imageItems.map((item, index) => (
                        <ImageItem key={`${item}-${index}`} imagePath={item} gallery={gallery} index={index} isLast={index === imageItems.length - 1} style={styles.carouselImageShell} />
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

const SectionTitle = ({ order, icon, title, subtitle }: any) => (
    <View style={styles.titleWrap}>
        <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={icon} size={20} color="#3F9F16" />
        </View>
        <View style={styles.titleTextWrap}>
            <Text style={styles.title}>{order}. {title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    </View>
);

const ImageItem = ({ imagePath, gallery, index, isLast, style }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={[style, isLast === false && styles.imageGap]}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalVisible(true)}
                style={styles.imageButton}
            >
                <Image
                    source={{ uri: `${SERVER_URL}${imagePath}` }}
                    style={styles.image}
                    contentFit="cover"
                    transition={500}
                />
                <View style={styles.zoomBadge}>
                    <MaterialCommunityIcons name="magnify-plus-outline" size={16} color="#FFFFFF" />
                </View>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className='bg-white w-full h-full'>
                    <ImageViewer
                        enablePreload={true}
                        flipThreshold={200}
                        pageAnimateTime={200}
                        enableSwipeDown={true}
                        swipeDownThreshold={100}
                        onCancel={() => setModalVisible(false)}
                        imageUrls={gallery}
                        index={index}
                    />
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.backButton}
                    >
                        <View className='flex-row justify-center items-center gap-2 px-5 py-2'>
                            <Image
                                transition={500}
                                source={icons.backArrow}
                                contentFit='contain'
                                className='w-[20px] h-[11px]'
                            />
                            <Text className=' text-[14px] text-[#747474]'>Quay lại</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        padding: 16,
    },
    expandedSection: {
        paddingBottom: 18,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#EAF7E4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    titleTextWrap: {
        flex: 1,
    },
    title: {
        color: '#10240B',
        fontFamily: 'Inter-Bold',
        fontSize: 17,
    },
    subtitle: {
        color: '#768172',
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        marginTop: 2,
    },
    galleryContent: {
        paddingRight: 2,
    },
    carouselImageShell: {
        width: 188,
        height: 136,
    },
    albumWrap: {
        width: '100%',
    },
    featuredImageShell: {
        width: '100%',
        height: 210,
        marginBottom: 10,
    },
    gridRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    gridImageShell: {
        flex: 1,
        height: 132,
    },
    gridImageLeft: {
        marginRight: 5,
    },
    gridImageRight: {
        marginLeft: 5,
    },
    gridImagePlaceholder: {
        flex: 1,
        marginLeft: 5,
    },
    imageGap: {
        marginRight: 10,
    },
    imageButton: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#EEF2EC',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    zoomBadge: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(16, 36, 11, 0.68)',
    },
    backButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
    },
});
