import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import Loader from "@/components/loader/loader";
import {
  Text,
} from "react-native";
export default function TabsIndex() {
  const { loading, user } = useUser();
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Redirect href={!user ? "/(routes)/login" : "/(tabs)"} />
      )}
    </>
  );
}
