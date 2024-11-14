import useUser from "@/hooks/auth/useUser";
import { Redirect } from "expo-router";
import React from "react";
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
