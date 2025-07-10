import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_REVIEW_KEY = 'pending_review_chinh_nha_ids';

export const addPendingReview = async (chinh_nha_id: number) => {
  const ids = await getPendingReviews();
  if (!ids.includes(chinh_nha_id)) {
    ids.push(chinh_nha_id);
    await AsyncStorage.setItem(PENDING_REVIEW_KEY, JSON.stringify(ids));
  }
};

export const removePendingReview = async (chinh_nha_id: number) => {
  const ids = await getPendingReviews();
  const newIds = ids.filter(id => id !== chinh_nha_id);
  await AsyncStorage.setItem(PENDING_REVIEW_KEY, JSON.stringify(newIds));
};

export const getPendingReviews = async (): Promise<number[]> => {
  const data = await AsyncStorage.getItem(PENDING_REVIEW_KEY);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}; 