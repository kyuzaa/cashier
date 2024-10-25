import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { formatRupiah } from '../../utils/format';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface ProductsScreenProps {
  navigation: NavigationProp<any>;
}


export default function ProductsScreen({ navigation }: ProductsScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus menu ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/products/${productId}`);
              fetchData();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus menu');
            }
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.categoryName}>
          {categories.find(c => c.id === item.category_id)?.name}
        </Text>
        <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Text style={styles.buttonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Menu</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Tambah Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.categoryPicker}
        >
          <Picker.Item label="Semua Kategori" value="" />
          {categories.map(category => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id.toString()}
            />
          ))}
        </Picker>
      </View>

      <FlatList
        data={products.filter(product => {
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesCategory = !selectedCategory || 
            product.category_id.toString() === selectedCategory;
          return matchesSearch && matchesCategory;
        })}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  filters: {
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  categoryPicker: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  productList: {
    gap: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryName: {
    color: '#6b7280',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#eab308',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});