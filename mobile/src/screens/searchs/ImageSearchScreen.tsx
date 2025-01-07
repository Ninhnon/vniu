// import React, { useState, useEffect } from 'react'
// import {
//   View,
//   ActivityIndicator,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Text,
//   Button,
//   Alert,
//   Image,
//   SafeAreaView
// } from 'react-native'
// import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker'
// import { ENV } from '@configs/env'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import { useTheme } from '@react-navigation/native'
// import { useNavigation } from '@react-navigation/native'
// import { IMAGES } from '@assets/images'
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
// import AppHeader from '@components/ui/navigation/header/AppHeader'
// import { Layout } from '@components/base'

// const FASTAPI_URL = 'http://10.0.2.2:8000/retrieve-image/'
// function getRandomInt(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }
// type ProductItem = {
//   ProductItemId: string
//   ProductImageUrl: string
//   productName: string
// }
// const ImageSearchScreen = () => {
//   const { colors } = useTheme()
//   const navigation = useNavigation()
//   const [image, setImage] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [results, setResults] = useState(null)
//   const pickImage = () => {
//     ImagePicker.openPicker({
//       mediaType: 'photo',
//       width: 100,
//       height: 80,
//       maxFiles: 1,
//       minFiles: 1,
//       cropping: true
//     })
//       .then((image) => {
//         setImage(image.path)
//         setResults(null)
//         uploadImage(image)
//       })
//       .catch((err) => {
//         console.log('ImagePicker Error: ', err)
//       })
//   }
//   const uploadImage = async (image: ImageOrVideo) => {
//     setLoading(true)
//     const formData = new FormData()
//     formData.append('file', {
//       uri: image.path,
//       type: image.mime,
//       name: `${getRandomInt(1, 10000)}.jpg`
//     })
//     console.log('🚀 ~ uploadImage ~ formData:', formData)

//     try {
//       const response = await fetch(FASTAPI_URL, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'multipart/form-data'
//         }
//       })
//       const data = await response.json()
//       setResults(data.retrieved_images) // Setting results directly from the API response
//       setLoading(false)
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       setLoading(false)
//     }
//   }

//   // const uploadImage = (image) => {
//   //   setLoading(true)
//   //   const formData = new FormData()
//   //   formData.append('file', {
//   //     uri: image.path,
//   //     type: image.mime,
//   //     name: 'uploaded_image.jpg'
//   //   })
//   //   formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
//   //   formData.append('cloud_name', 'dwhzyu0oo')

//   //   fetch('https://api.cloudinary.com/v1_1/dwhzyu0oo/image/upload', {
//   //     method: 'POST',
//   //     body: formData,
//   //     headers: {
//   //       Accept: 'application/json',
//   //       'Content-Type': 'multipart/form-data'
//   //     }
//   //   })
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       searchImage(data.url)
//   //     })
//   //     .catch((error) => {
//   //       Alert.alert('Error While Uploading')
//   //     })
//   // }
//   const searchImage = (imageUrl: string) => {
//     const params = new URLSearchParams()
//     params.append('url', imageUrl)

//     fetch(FASTAPI_URL, {
//       method: 'POST',
//       body: params.toString(),
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//       }
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const productItemIds: string[] = data.nearest_images.map((result: [string, string]) => result[1])
//         const uniqueProductItemIds = [...new Set(productItemIds)] // Loại bỏ trùng lặp
//         fetchProducts(uniqueProductItemIds)
//         setLoading(false)
//       })
//       .catch((err) => {
//         console.error(err)
//         setLoading(false)
//       })
//   }

//   const fetchProducts = (productItemIds: unknown[]) => {
//     fetch(ENV.API_URL + '/api/Product/get-products-by-ids', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(productItemIds)
//     })
//       .then((res) => {
//         return res.json()
//       })
//       .then((data) => {
//         // console.log('🚀 ~ .then ~ data:', data)
//         setResults(data.data)
//       })
//       .catch((err) => {
//         console.error('Error fetching products:', err)
//       })
//   }
//   const navigateToDetails = (productId: string) => {
//     navigation.navigate('Details', {
//       id: productId
//     })
//   }
//   const renderItem = ({ item }: { item: ProductItem }) => {
//     // console.log('🚀 ~ renderItem ~ item:', item)
//     // const productItem = item.productItems[0]
//     const productImageUrl = item.ProductImageUrl
//     // console.log('🚀 ~ renderItem ~ productImageUrl:', productImageUrl)
//     const productId = item.ProductItemId
//     // const productImageUrl = require('D:/DoAn/DoAn2/vniu/mobile/src/dataset/cloth/Calvin-Klein-Jeans-Utility-Overshirt-In-Olive-Green_14.jpg')

//     const originalPrice = 100
//     const discount = 5
//     const rating = 5

//     return (
//       <TouchableOpacity onPress={() => navigateToDetails(productId)} style={styles.productContainer}>
//         <Image source={{ uri: productImageUrl }} style={styles.productImage} />
//         <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 8, color: colors.text }}>{item.productName}</Text>
//         <Text style={{ fontSize: 14, marginTop: 4, color: colors.text }}>
//           ${originalPrice} <Text style={styles.discount}>-{discount}%</Text>
//         </Text>
//         <View style={styles.ratingContainer}>
//           <MaterialCommunityIcons name='star' size={16} color='#333' />
//           <Text style={{ marginLeft: 4, fontWeight: 'bold', color: colors.text }}>{rating}</Text>
//         </View>
//       </TouchableOpacity>
//     )
//   }

//   return (
//   <SafeAreaView style={styles.container}>
//     <AppHeader title='Image Search' />
//     <Layout.Wrapper justifyContent='center' alignItems='center'>
//       <View style={styles.pickImageContainer}>
//         <Text style={[styles.instruction, { color: colors.text }]}>Please pick an image</Text>
//         <Button title='Pick Image' onPress={pickImage} />
//       </View>
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {loading && <ActivityIndicator size='large' color='#0000ff' />}
//       {results && (
//         <ScrollView scrollEnabled={false} horizontal={true} style={{ flex: 1, width: '100%', paddingLeft: wp(1) }}>
//           <View>
//             <FlatList
//               numColumns={2}
//               showsVerticalScrollIndicator
//               data={results}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderItem}
//             />
//           </View>
//         </ScrollView>
//       )}
//       </Layout.Wrapper>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 16,
//     backgroundColor: '#fff'
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 20
//   },
//   pickImageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20
//   },
//   instruction: {
//     fontSize: 16,
//     marginRight: 10
//   },
//   resultItem: {
//     margin: 10,
//     alignItems: 'center'
//   },
//   resultImage: {
//     width: 100,
//     height: 100
//   },
//   productListContainer: {
//     flexGrow: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   productListWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   productContainer: {
//     width: wp(48),
//     padding: 8
//   },
//   productImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover'
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 8
//   },
//   productPrice: {
//     fontSize: 14,
//     marginTop: 4
//   },
//   discount: {
//     color: 'green'
//   },
//   productDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 4
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8
//   },
//   rating: {
//     marginLeft: 4,
//     fontWeight: 'bold'
//   },
//   soldCount: {
//     marginLeft: 8,
//     color: '#888'
//   },
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0'
//   },
//   header: {
//     width: '90%',
//     margin: 50,
//     height: 50,
//     fontWeight: 'bold',
//     fontSize: 24,
//     marginBottom: '2%',
//     flexDirection: 'row',
//     textAlign: 'center',
//     alignItems: 'center',
//     alignSelf: 'center'
//   },
//   text: {
//     left: 10
//   },
//   search: {
//     position: 'relative',
//     height: '100%',
//     width: '100%',
//     justifyContent: 'center',
//     borderRadius: 20,
//     borderWidth: 1
//   },
//   list: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   }
// })

// export default ImageSearchScreen

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker'

import Icon from 'react-native-vector-icons/Ionicons';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import { PERMISSIONS, request } from 'react-native-permissions';

const ImageSearchScreen = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);
  const pickImage = () => {
    ImagePicker.openCamera({
      width: 150,
      height: 200,
      cropping: true,
      includeExif: true,
    })
      .then((image) => {
        setCapturedImage(image.path)
        // uploadImage(image)
      })
      .catch((err) => {
        console.log('ImagePicker Error: ', err)
      })
  }
  const checkPermissions = async () => {
    try {
      let cameraPermission;
      let photoLibraryPermission;

      if (Platform.OS === 'android') {
        cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        photoLibraryPermission = await request(
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
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
      console.log("🚀 ~ loadGalleryImages ~ photos:", photos)
      setGalleryImages(photos.edges.map((edge) => edge.node.image));
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
            source={{ uri: capturedImage.uri }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.closePreviewButton}
            onPress={() => setCapturedImage(null)}
          >
            <Icon name="close-circle" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderGallery = () => (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryTitle}>Gallery</Text>
      {galleryImages.length > 0 ? (
        <FlatList
          data={galleryImages}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.galleryItem}
              onPress={() => setCapturedImage({ uri: item.uri })}
            >
              <Image source={{ uri: item.uri }} style={styles.galleryImage} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noImagesText}>No images found.</Text>
      )}
    </View>
  );
  const takePhotoRef = useRef<TKycTakePhotoRef>(null);
  const _handleOnTakePhoto = useCallback(
    (uri: string) => {
     console.log(uri);
    },[]
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      {renderPreview()}
      {renderGallery()}
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
    color:'red'
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
});

export default ImageSearchScreen;
