import { useAuth } from '@/context/GlobalProvider'
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
const App = () => {
  const { authState } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState<string>('/sign-in');

  useEffect(() => {
    if (authState && authState.isLoggedIn) {
      setRedirectUrl('/home');
    }
  }, [authState]);

  return (
    <Redirect href={redirectUrl} />
  )
}
export default App