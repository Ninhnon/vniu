import { appThemes } from '@constants/appTheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { RootNavigator } from '@navigators'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import Payment from '@screens/payments/Payment'
import React, { useContext } from 'react'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Host } from 'react-native-portalize'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { AppContext } from 'src/contexts/app.context'

const App = () => {
  const deviceColorScheme = useColorScheme()
  // const [theme, setTheme] = useState(deviceColorScheme === 'dark' ? 'dark' : 'light')

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  // }

  const { themeTest, setThemeTest } = useContext(AppContext)
  const toggleTheme = () => {
    setThemeTest((prevTheme) => (prevTheme === appThemes.light ? appThemes.dark : appThemes.light))
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop:16 }} >
        <StatusBar
          translucent
          barStyle={themeTest === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor='transparent'
        />
        <Host>
          <NavigationContainer theme={themeTest === 'dark' ? DarkTheme : DefaultTheme}>
            <BottomSheetModalProvider>
              <RootNavigator toggleTheme={toggleTheme} />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </Host>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App
