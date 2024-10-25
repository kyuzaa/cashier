import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api } from '../../services/api';
import { Transaction, CartItem } from '../../types';
import { formatRupiah } from '../../utils/format';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.data.transactions);
      setTotalAmount(response.data.data.total_amount);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat transaksi');
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (tableNumber) params.append('nomor_meja', tableNumber);
      if (date) params.append('tanggal', date.toISOString().split('T')[0]);

      const response = await api.get(`/transactions/search?${params}`);
      setTransactions(response.data.data.transactions);
      setTotalAmount(response.data.data.total_amount);
    } catch (error) {
      Alert.alert('Error', 'Gagal mencari transaksi');
    }
  };

  const handleUpdateStatus = async (transactionId: number, currentStatus: string) => {
    try {
      await api.put(`/transactions/${transactionId}/status`);
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengupdate status');
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.tableNumber}>Meja #{item.nomor_meja}</Text>
        <Text style={styles.date}>
          {new Date(item.tanggal).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem: CartItem, index: number) => (
          <Text key={index} style={styles.orderItem}>
            {orderItem.product.name} - {orderItem.quantity}x {formatRupiah(orderItem.product.price)}
          </Text>
        ))}
      </View>

      <View style={styles.transactionFooter}>
        <Text style={styles.total}>
          Total: {formatRupiah(item.total_amount)}
        </Text>
        
        {item.status !== '2' && (
          <TouchableOpacity
            style={[
              styles.statusButton,
              item.status === '0' ? styles.cookingButton : styles.paymentButton
            ]}
            onPress={() => handleUpdateStatus(item.id, item.status)}
          >
            <Text style={styles.statusButtonText}>
              {item.status === '0' ? 'Selesai Dimasak' : 'Selesai Dibayar'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaksi</Text>

      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Nomor Meja"
          value={tableNumber}
          onChangeText={setTableNumber}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
                handleSearch();
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.transactionsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada transaksi</Text>
        }
      />

      {transactions.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Keseluruhan:</Text>
          <Text style={styles.totalAmount}>{formatRupiah(totalAmount)}</Text>
        </View>
      )}
    </View>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case '0':
      return styles.statusPending;
    case '1':
      return styles.statusCooking;
    case '2':
      return styles.statusComplete;
    default:
      return {};
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case '0':
      return 'Belum Dimasak';
    case '1':
      return 'Selesai Dimasak';
    case '2':
      return 'Selesai Dibayar';
    default:
      return 'Unknown';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#374151',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  transactionsList: {
    gap: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#6b7280',
  },
  itemsList: {
    marginBottom: 8,
  },
  orderItem: {
    color: '#374151',
    marginBottom: 4,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusButton: {
    padding: 8,
    borderRadius: 6,
  },
  cookingButton: {
    backgroundColor: '#3b82f6',
  },
  paymentButton: {
    backgroundColor: '#059669',
  },
  statusButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statusBadge: {
    padding: 6,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#fee2e2',
  },
  statusCooking: {
    backgroundColor: '#dbeafe',
  },
  statusComplete: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
});
