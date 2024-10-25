import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dashboardService } from '../../services/api';
import { formatRupiah } from '../../utils/format';

interface DashboardData {
  total_sales: number;
  total_transactions: number;
  total_menu: number;
}

export default function HomeScreen() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatRupiah(data?.total_sales || 0)}</Text>
          <Text style={styles.statLabel}>Total Penjualan</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data?.total_transactions || 0}</Text>
          <Text style={styles.statLabel}>Total Transaksi</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data?.total_menu || 0}</Text>
          <Text style={styles.statLabel}>Total Menu</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
});