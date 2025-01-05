import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { StyleSheet, View, Text, FlatList, Image, SafeAreaView } from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import FilterView from '@components/FilterView'
import { TabsStackScreenProps } from 'src/navigators/TabsNavigator'
import { useInfiniteQuery } from '@tanstack/react-query'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useProduct } from '@hooks/useProduct'
import SearchHeaderHome from '@components/ui/home/SearchHeaderHome'
import { Layout } from '@components/base'
import Banner from '@components/ui/home/Banner'
import CategoriesHome from '@components/ui/home/CategoriesHome'

const HomeScreen = ({ navigation }: TabsStackScreenProps<'Home'>) => {
  const { colors } = useTheme()
  const [categoryIndex, setCategoryIndex] = useState(0)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { fetchProduct } = useProduct();
  const openFilterModal = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: 
    ({ pageParam = 1 }: { pageParam?: number }) =>
      fetchProduct({
        PageIndex: pageParam,
        PageSize: 4,
        SearchTerm: '',
        categoryIds: '',      
        colourIds: '',
        price_range : '0-500',
      }),
      getNextPageParam: (lastPage: any, pages) => {
        const nextPage = pages.length + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1
  })
  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const products = data?.pages.map((page) => page.data)

  const renderItem = ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {
            id: item.id
          })
        }}
        style={styles.productContainer}
      >
        <Image source={{ uri: item[0].productImages[0].imageUrl }} style={styles.productImage} />
        <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: 'bold', marginTop: 8, color: colors.text }}>{item[0].name}</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'red' }}>
          ${item[0].salePriceMin}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 4, gap:4 }}>
        <Text style={{ fontSize: 12, color: colors.text, backgroundColor:'#00DDD1', borderRadius: 4, padding: 2, paddingHorizontal: 4 }}>
        {'-'}{(Math.round(item[0].originalPrice - item[0].salePriceMin) *100/item[0].originalPrice).toFixed(2)}{'%'}
        </Text>
        <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: colors.text, padding: 2, paddingHorizontal: 4 }}>
        ${item[0].originalPrice}
        </Text>
        </View>
      </TouchableOpacity>
    )
  
  

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {
            id: item.id
          })
        }}
        style={styles.productCard}
      >
        <Image source={{ uri: item[0].productImages[0].imageUrl }} style={styles.productImage} />
        <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: 'bold', marginTop: 8, color: colors.text }}>{item[0].name}</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: 'red' }}>
          ${item[0].salePriceMin}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 4, gap:4 }}>
        <Text style={{ fontSize: 12, color: colors.text, backgroundColor:'#00DDD1', borderRadius: 4, padding: 2, paddingHorizontal: 4 }}>
        {'-'}{(Math.round(item[0].originalPrice - item[0].salePriceMin) *100/item[0].originalPrice).toFixed(2)}{'%'}
        </Text>
        <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: colors.text, padding: 2, paddingHorizontal: 4 }}>
        ${item[0].originalPrice}
        </Text>
        </View>
      </TouchableOpacity>
  );

  return (
    
      <SafeAreaView style={{ paddingVertical: 24, backgroundColor: '#fff' }}>

      <SearchHeaderHome navigation={navigation} />
      <Layout.BodyScrollView>
         {/* FilterView             onPress={openFilterModal} */}
        <Banner/>
        <CategoriesHome />
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}
            size='large'
            color='#0000ff'
          />
        ) : isError ? null : (
          <>
              {/* Top Deals Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle,{color: colors.text}]}>🔥 TOP DEAL • HOT SALES</Text>
        <FlatList
          data={products?.slice(0, 3)}
          horizontal
          renderItem={renderProduct}
          keyExtractor={(item) => item[0].id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Suggested Products Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle,{color: colors.text}]}>PRODUCTS YOU CAN LIKE</Text>
        <FlatList
          data={products?.slice(3, 6)}
          horizontal
          renderItem={renderProduct}
          keyExtractor={(item) => item[0].id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>
      <View style={styles.section2}>

      <Text style={[styles.sectionTitle,{color: colors.text, paddingHorizontal:10}]}>TOP PRODUCTS</Text>

                <ScrollView scrollEnabled={false} horizontal={true} style={{ flex: 1, width: '100%', padding: wp(1) }}>

            <View>
              <FlatList
              contentContainerStyle={{ gap: 8, padding: 8, marginBottom: 50 }}
                numColumns={2}
                showsVerticalScrollIndicator
                data={products}
                keyExtractor={(item) => item[0].id}
                renderItem={renderItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                  return isFetchingNextPage ? <ActivityIndicator /> : null
                }}
              />
            </View>
          </ScrollView>
          </View>
          </>
        )}
        <View style={{ height: 50 }} />
     
      <BottomSheetModal
        snapPoints={['85%']}
        index={0}
        ref={bottomSheetModalRef}
        backdropComponent={(props) => <View />}
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: colors.card
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.primary
        }}
      >
        <FilterView />
      </BottomSheetModal>
      </Layout.BodyScrollView>
      </SafeAreaView>
          )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  section2: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalList: {
    flexDirection: 'row',
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
    resizeMode: 'cover'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  productPrice: {
    fontSize: 14,
    marginTop: 4
  },
  discount: {
    color: 'green'
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold'
  },
  soldCount: {
    marginLeft: 8,
    color: '#888'
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  }
})

export default HomeScreen
