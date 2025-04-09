import { View, Text, Alert, Button } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/common/CustomHeader";
import FileViewer from "react-native-file-viewer";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from "expo-router";
export default function HopDongDetailScreen() {
  // const [fileUri, setFileUri] = useState('');

  // useEffect(() => {
  //   // Tải file .docx từ URL
  //   const downloadFile = async () => {
  //     const url = "https://nhakhoathuyanh.xyz/public/img/khach-hang/119990123456789/library/hop-dong/H%C4%90CN%20-%20D%C6%B0%C6%A1ng%20Th%E1%BB%8B%20Huy%E1%BB%81n%20Trang.docx"; // Thay thế bằng URL thực tế
      const fileUri = FileSystem.documentDirectory + "file.docx";
  //     try {
  //       const { uri } = await FileSystem.downloadAsync(url, localUri);
  //       setFileUri(uri);
  //     } catch (error) {
  //       console.error(error);
  //       Alert.alert("Error", "Không thể tải file");
  //     }
  //   };

  //   downloadFile();
  // }, []);

  // const openFile = () => {
  //   if (fileUri) {
  //     // Mở file .docx đã tải về
  //     console.log(fileUri)

  //     FileViewer.open(fileUri)
  //       .then(() => {
  //         console.log("File đã được mở thành công");
  //       })
  //       .catch((error) => {
  //         console.error("Không thể mở file:", error);
  //         Alert.alert("Error", "Không thể mở file");
  //       });
  //   } else {
  //     Alert.alert("Error", "File chưa được tải");
  //   }
  // };

  const downloadFile = async () => {
    const uri = "https://nhakhoathuyanh.xyz/public/img/khach-hang/119990123456789/library/hop-dong/test.pdf"; // Replace with the URL of the file you want to download
    const fileUri = FileSystem.documentDirectory + 'test.pdf'; // Define the local path

    try {
      // Download the file and save it to the local directory
      const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);

      Alert.alert('Download Successful', `File saved to: ${downloadedUri}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Download Failed', 'There was an error downloading the file.');
    }
  };


  const { headerTitle }: any = useLocalSearchParams();
  return (
    <>
      <CustomHeader
        title={headerTitle}
        customStyle="bg-transparent"
        downloadBtn={true}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Mở tài liệu" onPress={downloadFile} />
      </View>
    </>
  );
}
