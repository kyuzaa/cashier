import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useCart } from '../../contexts/CartContext';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { api } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number; // Added stock property
  category_id: number; // Added category_id property
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

export default function POSScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/pos/products');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const response = await api.get(`/pos/search?query=${query}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const renderCategory = ({ item: category }: { item: Category }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      <FlatList
        data={category.products}
        renderItem={({ item: product }) => (
          <ProductCard
            product={product}
            onPress={() => addItem(product)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productGrid}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Cari menu..."
      />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productGrid: {
    justifyContent: 'space-between',
  },
});