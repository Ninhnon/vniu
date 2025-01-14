import AppHeader from '@components/ui/navigation/header/AppHeader';
import {ENV} from '@configs/env';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import DeepARView, {
  IDeepARHandle,
  Camera,
  CameraPermissionRequestResult,
  ErrorTypes,
  CameraPositions,
} from 'react-native-deepar';
import {PERMISSIONS, request} from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
const effects = [
  {
    path: 'https://demo.deepar.ai/ads/effects/tom-ford-FT1060-30f.deepar',
    name: 'Tom Ford Xavier Gold',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/tom-ford-FT1060_30F_64MM_B.jpeg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/tom-ford-FT1058.deepar',
    name: 'Tom Ford Alejandro Black',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/tom-ford-alejandro.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/tom-ford-FT0009P.deepar',
    name: 'Tom Ford Whitney',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/tom-ford-whitney.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/tom-ford-kyler-FT1043.deepar',
    name: 'Tom Ford Kyler',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/tom-ford-kyler.jpeg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/jimmy-choo-MEGSS51E807.deepar',
    name: 'Jimmy Choo Megs',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/jimmy-choo-megs.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/jimmy-choo-LUCINES55EDXL.deepar',
    name: 'Jimmy Choo Lucine',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/jimmy-choo-lucine.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/jimmy-choo-auri.deepar',
    name: 'Jimmy Choo Auri',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/jimmy-choo-auri.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/jimmy-choo-JC124.deepar',
    name: 'Jimmy Choo JC 124',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/jimmy-choo-jc-124.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-PR14Z_E1AB_FE09S_C_050.deepar',
    name: 'Prada Symbole - Black',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-black.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-PR14Z_E19D_FE01T_C_050.deepar',
    name: 'Prada Symbole - Marbleized Black and Yellow',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-black-yellow.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-PR14Z_E142_F05S0_C_050.deepar',
    name: 'Prada Symbole - Chalk White',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-white.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-SPR26Z_E12L_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Orange',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-oval-orange.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-SPR26Z_E16K_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Black',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-oval-black.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/prada-SPR26Z_E17K_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Chalk White',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/prada-symbole-oval-white.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/ralph-lauren-RL8188Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Antibes Dark Havana',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/stirrup-antibes.png',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/ralph-lauren-RL8190Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Ricky Dark Havana',
    image: 'https://demo.deepar.ai/ads/glasses/assets/images/stirrup-ricky.png',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/ralph-lauren-RL8189Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Shield Dark Havana',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/stirrup-shield.png',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/Rb1971V2943.deepar',
    name: 'Ray Ban 1971/V 2943',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/ray-ban_1971_v_2943.jpeg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/RB8125M9165.deepar',
    name: 'Ray Ban Aviator Titanium (Silver)',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/ray-ban-aviator-titanium-silver.jpeg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/ray-ban-Rb3580n043e4.deepar',
    name: 'Ray Ban Blaze Cat Eye',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/ray-ban-blaze-cat-eye.jpeg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/RadarEvPath.deepar',
    name: 'Oakley Radar EV Path',
    image:
      'https://demo.deepar.ai/ads/glasses/assets/images/oakley-radar-ev.webp',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/oakley-sutro.deepar',
    name: 'Oakley Sutro',
    image: 'https://demo.deepar.ai/ads/glasses/assets/images/oakley-sutro.webp',
  },
];

const GlassTryOn = () => {
  const deepARRef = useRef<IDeepARHandle>(null);
  const [permsGranted, setPermsGranted] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const getPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const isCameraAllowed =
      cameraPermission === CameraPermissionRequestResult.AUTHORIZED;

    if (isCameraAllowed) {
      setPermsGranted(true);
    } else {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      let cameraPermission;

      if (Platform.OS === 'android') {
        cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      } else {
        cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      }

      if (cameraPermission === 'granted') {
        setPermsGranted(true);
      }
    } catch (err) {
      console.error('Permission Error:', err);
    }
  };
  useEffect(() => {
    checkPermissions();
  }, []);
  const loadEffect = (effectPath: string) => {
    setSelectedEffect(effectPath);
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', effectPath)
      .then(res => {
        deepARRef?.current?.switchEffectWithPath({
          path: res.path(),
          slot: 'mask',
        });
      });
  };

  const renderEffectItem = ({
    item,
  }: {
    item: {path: string; name: string; image: string};
  }) => (
    <TouchableOpacity
      onPress={() => loadEffect(item.path)}
      style={[styles.effectItem]}>
      <Image
        source={{uri: item.image}}
        style={[
          styles.effectImage,
          selectedEffect === item.path && styles.selectedEffectItem,
        ]}
      />
      <Text style={styles.effectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDeepARView = () => {
    if (permsGranted === false) {
      return null;
    }
    return (
      <>
        <DeepARView
          ref={deepARRef}
          apiKey={ENV.DEEPAR_SDK}
          videoWarmup={false}
          position={CameraPositions.FRONT}
          style={styles.deepARView}
          onError={(text: String, type: ErrorTypes) => {
            console.log('onError =>', text, 'type =>', type);
          }}
        />
        <FlatList
          data={effects}
          horizontal
          keyExtractor={item => item.path}
          renderItem={renderEffectItem}
          contentContainerStyle={styles.effectList}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Glass Try On" />
      <View style={styles.container}>{renderDeepARView()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deepARView: {
    width: Dimensions.get('window').width,
    height: '80%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  effectList: {
    paddingVertical: 10,
  },
  effectItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  effectImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  effectName: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
  },
  selectedEffectItem: {
    borderColor: 'blue',
    borderWidth: 2,
  },
});

export default GlassTryOn;
