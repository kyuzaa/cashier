import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Picker } from 'react-native';
import { api } from '../services/api';
import { formatRupiah } from '../utils/format';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      const { name, category_id, price, image } = response.data.data;
      setName(name);
      setCategory(category_id);
      setPrice(formatRupiah(price));
      setImage(image);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await api.put(`/products/${productId}`, {
        name,
        category_id: category,
        price: parseInt(price.replace(/\D/g, '')),
        image
      });
      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
    }
  };

  const handleImageChange = async () => {
    // Implement image picker logic and set image state
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Edit Menu</Text>

      <Text style={{ marginBottom: 8 }}>Nama Menu</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={{ marginTop: 16, marginBottom: 8 }}>Kategori</Text>
      <Picker
        selectedValue={category}
        onValueChange={itemValue => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Kategori" value="" />
        {categories.map(cat => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 16, marginBottom: 8 }}>Harga</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={(text) => setPrice(formatRupiah(text))}
        keyboardType="numeric"
      />

      <Text style={{ marginTop: 16, marginBottom: 8 }}>Gambar</Text>
      <TouchableOpacity onPress={handleImageChange}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>Pilih Gambar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 8,
    borderRadius: 8,
  },
  placeholderText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
