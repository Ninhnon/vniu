import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {PERMISSIONS, request} from 'react-native-permissions';
import {appColors} from '@constants/appColors';
import {useNavigation, useTheme} from '@react-navigation/native';
import BottomSheetHeader from '@components/ui/search/BottomSheetHeader';
import {postRequest} from '@configs/fetch';
import {ENV} from '@configs/env';
import {BottomSheet, Layout} from '@components/base';
import {Hooks} from '@hooks/index';

const ImageSearchScreen = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [galleryImages, setGalleryImages] = useState<
    {uri: string; height: number; width: number}[]
  >([]);
  const [capturedImage, setCapturedImage] = useState<{uri: string} | null>(
    null,
  );
  const [productItemIds, setProductItemIds] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const snapPoints = useMemo(() => [wp(25), wp(50), wp(75)], []);
  useEffect(() => {
    checkPermissions();
  }, []);
  useEffect(() => {
    if (capturedImage) {
      uploadImage(capturedImage);
    }
  }, [capturedImage]);
  useEffect(() => {
    if (productItemIds && productItemIds.length > 0) {
      fetchProductForImageSearch({productItemIds}).then(data => {
        setResults(data.data);
      });
    }
  }, [productItemIds]);
  const uploadImage = async (image: {uri: any}) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'cropped.jpg',
    });

    try {
      const response = await fetch(
        `${ENV.API_URL}/image-search/images/search-by-image`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
      const data = await response.json();
      setProductItemIds(data.productItemIds);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductForImageSearch = async ({
    productItemIds = [],
  }: {
    productItemIds?: string[] | null;
  }) => {
    let endpoint = '/api/v1/products/filter-and-sort?PageIndex=1&PageSize=8';
    const {minPrice, maxPrice} = {minPrice: 0, maxPrice: 500};
    const products = await postRequest({
      endPoint: endpoint,
      formData: {
        CategoryIds: [],
        ratingValue: 0,
        minPrice,
        maxPrice,
        colourIds: [],
        sizeOptionIds: [],
        productItemIds,
      },
      isFormData: false,
    });

    return {
      data: products.data.value.items,
    };
  };
  const pickImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeExif: true,
    })
      .then(image => {
        setCapturedImage({uri: image.path}); // uploadImage(image)
      })
      .catch(err => {
        console.log('ImagePicker Error: ', err);
      });
  };
  const cropImage = () => {
    if (capturedImage) {
      ImagePicker.openCropper({
        path: capturedImage.uri,
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          setCapturedImage({uri: image.path});
        })
        .catch(err => {
          console.log('Cropper Error: ', err);
        });
    }
  };
  const cropImage2 = (uri: string) => {
    ImagePicker.openCropper({
      path: uri,
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setCapturedImage({uri: image.path});
      })
      .catch(err => {
        console.log('Cropper Error: ', err);
      });
  };

  const checkPermissions = async () => {
    try {
      let cameraPermission;
      let photoLibraryPermission;

      if (Platform.OS === 'android') {
        cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        photoLibraryPermission = await request(
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
      } else {
        cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
        photoLibraryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      }

      if (
        cameraPermission === 'granted' &&
        photoLibraryPermission === 'granted'
      ) {
        loadGalleryImages();
      } else {
        Alert.alert('Permissions Required', 'Please grant all permissions.');
      }
    } catch (err) {
      console.error('Permission Error:', err);
    }
  };

  const loadGalleryImages = async () => {
    try {
      const photos = await CameraRoll.getPhotos({
        first: 50,
        assetType: 'Photos',
      });
      setGalleryImages(photos.edges.map(edge => edge.node.image));
    } catch (err) {
      console.error('Error Loading Gallery:', err);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Image Search</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Icon name="camera" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreview = () => {
    if (capturedImage) {
      return (
        <View style={styles.previewContainer}>
          <Image
            source={{uri: capturedImage.uri}}
            style={styles.previewImage}
          />
          <TouchableOpacity style={styles.cropButton} onPress={cropImage}>
            <Icon name="crop" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closePreviewButton}
            onPress={() => setCapturedImage(null)}>
            <Icon name="close-circle" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.previewContainer,
          {
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: appColors.Primary,
            borderRadius: 10,
            margin: 10,
          },
        ]}>
        <TouchableOpacity onPress={pickImage} style={{padding: 10}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: appColors.Primary,
            }}>
            Please pick an image
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGallery = () => (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryTitle}>Gallery</Text>
      {galleryImages.length > 0 ? (
        <FlatList
          data={galleryImages}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.galleryItem}
              onPress={() => {
                cropImage2(item.uri);
              }}>
              <Image source={{uri: item.uri}} style={styles.galleryImage} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noImagesText}>No images found.</Text>
      )}
    </View>
  );
  const {
    ref: bottomSheetRef,
    open: openBottomSheet,
    close: closeBottomSheet,
  } = Hooks.App.useAppBottomSheet();
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Details', {
          id: item.id,
        });
      }}
      style={styles.productContainer}>
      <Image
        source={{uri: item.productImages[0].imageUrl}}
        style={styles.productImage}
      />
      <Text
        numberOfLines={2}
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginTop: 8,
          color: colors.text,
        }}>
        {item.name}
      </Text>
      <Text style={{fontSize: 14, marginTop: 4, color: 'red'}}>
        ${item.salePriceMin}
      </Text>
      <View style={{flexDirection: 'row', marginTop: 4, gap: 4}}>
        <Text
          style={{
            fontSize: 12,
            color: colors.text,
            backgroundColor: '#00DDD1',
            borderRadius: 4,
            padding: 2,
            paddingHorizontal: 4,
          }}>
          {'-'}
          {(
            (Math.round(item.originalPrice - item.salePriceMin) * 100) /
            item.originalPrice
          ).toFixed(2)}
          {'%'}
        </Text>
        <Text
          style={{
            textDecorationLine: 'line-through',
            fontSize: 12,
            color: colors.text,
            padding: 2,
            paddingHorizontal: 4,
          }}>
          ${item.originalPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    if (results && capturedImage) openBottomSheet();
    else closeBottomSheet();
  }, [results, capturedImage]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      {renderPreview()}
      {renderGallery()}
      <BottomSheet ref={bottomSheetRef}>
        <Layout.Wrapper>
          <BottomSheetHeader close={closeBottomSheet} />
          <FlatList
            numColumns={2}
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false} // Allow vertical scroll
            contentContainerStyle={styles.flatListContent}
          />
          <View style={{height: 50, width: '100%'}} />
        </Layout.Wrapper>
      </BottomSheet>
      <Modal visible={loading} transparent animationType="fade">
        <View
          style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={appColors.Primary} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  previewContainer: {
    height: 300,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  galleryContainer: {
    flex: 1,
    padding: 8,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'red',
  },
  galleryItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  noImagesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  cropButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 10,
  },
  cropButtonText: {
    color: '#fff',
  },
  bottomSheetContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
    paddingBottom: 50,
  },

  productContainer: {
    width: wp(46),
    // width: 160,
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productCard: {
    width: wp(35),
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  discount: {
    color: 'green',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  soldCount: {
    marginLeft: 8,
    color: '#888',
  },
});

export default ImageSearchScreen;
