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
    path: 'https://demo.deepar.ai/ads/effects/nike-air-jordan-miles-morales.deepar',
    name: 'Air Jordan I Miles Morales',
    image:
      'https://sneakerdaily.vn/wp-content/uploads/2020/12/Giay-nam-Air-Jordan-1-Retro-High-OG-Origin-Story-555088-602.jpg',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/nike-airmax-270-red-white.deepar',
    name: 'Airmax 270 (Red/White)',
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/08/dj5172-100.png',
  },
  {
    path: 'https://demo.deepar.ai/ads/effects/nike-airmax-90-dusty-grey.deepar',
    name: 'Airmax 90 (Dusty Grey)',
    image:
      'https://cdn.sneakerbaron.nl/uploads/2024/08/25011404/nike-sneakers-air-max-90-8211-grijsblauwrood-maat-46-8216grijs8217-8216rood8217-8216blauw8217-dm0029-005-04.png',
  },
];

const ShoeTryOn = () => {
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

  const [cameraPosition, setCameraPosition] = useState(CameraPositions.FRONT);

  const switchCamera = () => {
    if (deepARRef) {
      setCameraPosition(
        cameraPosition === CameraPositions.FRONT
          ? CameraPositions.BACK
          : CameraPositions.FRONT,
      );
    }
  };
  const loadEffect = (effectPath: string) => {
    setSelectedEffect(effectPath);
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', effectPath)
      .then(res => {
        deepARRef?.current?.switchEffectWithPath({
          path: res.path(),
          slot: 'effect',
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
          position={cameraPosition}
          style={styles.deepARView}
          onError={(text: String, type: ErrorTypes) => {
            console.log('onError =>', text, 'type =>', type);
          }}
        />
        <TouchableOpacity onPress={switchCamera}>
          <Text style={{color: 'red'}}>Switch Camera</Text>
        </TouchableOpacity>
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
      <AppHeader title="Shoe Try On" />
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

export default ShoeTryOn;
