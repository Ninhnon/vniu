import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {ENV} from '@configs/env';
import {useTheme} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SearchHeader from '@components/ui/search/SearchHeader';
import {InvestSearchContextProvider} from 'src/contexts/investSearchContext';
import {FormProvider, useForm} from 'react-hook-form';
import {TInvestSearchForm} from '@appTypes/schemaType';
import {Validators} from '@configs/validators';
import {zodResolver} from '@hookform/resolvers/zod';

const SearchScreen = () => {
  const {colors} = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ENV.API_URL}/api/Product/get-all`, {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`
          //   }
        });
        setProducts(response.data.data);
      } catch (error) {
        console.log('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const filteredproducts = products.filter(products => {
    return products.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });
  const searchproducts = query => {
    // Gọi API tìm kiếm ở đây và cập nhật kết quả tìm kiếm
    setSearchResults(filteredproducts);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    searchproducts(text);
  };
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Details', {
          id: item.id,
        });
      }}
      style={styles.productContainer}>
      <Image
        source={{uri: item[0].productImages[0].imageUrl}}
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
        {item[0].name}
      </Text>
      <Text style={{fontSize: 14, marginTop: 4, color: 'red'}}>
        ${item[0].salePriceMin}
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
            (Math.round(item[0].originalPrice - item[0].salePriceMin) * 100) /
            item[0].originalPrice
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
          ${item[0].originalPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const form = useForm<TInvestSearchForm>({
    resolver: zodResolver(Validators.formInvestSearchSchema),
  });
  return (
    <InvestSearchContextProvider>
      <FormProvider {...form}>
        <SafeAreaView
          style={{paddingTop: 24, backgroundColor: 'white', flex: 1}}>
          <SearchHeader />
          <ScrollView style={styles.container}>
            {/* <View style={styles.header}>
        <View style={styles.search}>
          <TextInput
            placeholder='Search'
            placeholderTextColor={'black'}
            style={[styles.search, { color: 'black' }]}
            onChangeText={handleSearch}
            value={searchQuery}
            hitSlop={{ top: 20, bottom: 20, left: 100, right: 50 }}
          />
        </View>
      </View>  */}
            <ScrollView
              scrollEnabled={false}
              horizontal={true}
              style={{flex: 1, width: '100%', paddingLeft: wp(1)}}>
              <View>
                <FlatList
                  numColumns={2}
                  showsVerticalScrollIndicator
                  data={searchResults}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      </FormProvider>
    </InvestSearchContextProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  productListContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productContainer: {
    width: wp(48),
    padding: 8,
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
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  header: {
    width: '90%',
    margin: 50,
    marginTop: 80,
    height: 50,
    marginBottom: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    left: 10,
  },
  search: {
    position: 'relative',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  image: {
    position: 'absolute',
    height: 20,
    width: 20,
    zIndex: 3,
    left: '90%',
  },
  list: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default SearchScreen;
