jest.mock('react-native-pdf', () => {
    return () => <></>;  // Trả về một component trống để không gặp phải lỗi khi render
});
