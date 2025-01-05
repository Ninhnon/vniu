import { useTheme } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const clothingCategories = [
    { id: 'tall', label: 'Tall', icon: '👖', color: 'rgba(0, 0, 255, 0.3)' },
    { id: 'polo', label: 'Polo', icon: '👕', color: 'rgba(255, 192, 203, 0.3)' },
    { id: 't-shirt', label: 'T-Shirt', icon: '👕', color: 'rgba(255, 255, 0, 0.3)' },
    { id: 'shorts', label: 'Shorts', icon: '🩳', color: 'rgba(0, 128, 0, 0.3)' },
    { id: 'shirt', label: 'Shirt', icon: '👔', color: 'rgba(0, 0, 255, 0.3)' },
    { id: 'jeans', label: 'Jeans', icon: '👖', color: 'rgba(255, 192, 203, 0.3)' },
    { id: 'baggy', label: 'Baggy', icon: '👕', color: 'rgba(255, 255, 0, 0.3)' },
    { id: 'hoodie', label: 'Hoodie', icon: '🧥', color: 'rgba(0, 128, 0, 0.3)' },
    { id: 'vest', label: 'Vest', icon: '🦺', color: 'rgba(0, 0, 255, 0.3)' },
    { id: 'jacket', label: 'Jacket', icon: '🧥', color: 'rgba(255, 192, 203, 0.3)' },
];

const CategoriesHome = () => {
    const { colors } = useTheme();
    return (
        <ScrollView style={styles.categoriesContainer}>
            <View style={styles.grid}>
                {clothingCategories.slice(0, 5).map((cat) => (
                    <View key={cat.id} style={styles.category}>
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                            <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                        </View>
                        <Text style={{ marginTop: 8, fontSize: 12, color: colors.text }}>{cat.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.grid}>
                {clothingCategories.slice(5, 10).map((cat) => (
                    <View key={cat.id} style={styles.category}>
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                            <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                        </View>
                        <Text style={{ marginTop: 8, fontSize: 12, color: colors.text }}>{cat.label}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default CategoriesHome;

const styles = StyleSheet.create({
    categoriesContainer: { flex: 1, backgroundColor: '#fff' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 16,
        paddingVertical:8
     },
    category: { alignItems: 'center' },
    categoryIcon: { 
        width: 48, 
        height: 48, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 24, 
        borderWidth: 2, 
        borderColor: '#F0F0F0' 
    },
    categoryEmoji: { fontSize: 24 },
});