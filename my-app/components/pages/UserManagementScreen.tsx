import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Avatar from '../layouts/Avatar';
import { LinearGradient } from 'expo-linear-gradient'; // Thêm LinearGradient từ expo-linear-gradient
import colors from '../../constants/colors';
import BaseButton from '../models/BaseButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Position } from '../../types/management';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { User } from '../../types/management';
import { useGetUserByManagerIdQuery } from '../../api/magementApi';
// Dữ liệu mẫu (có thể thay thế bằng dữ liệu từ API)


// Định nghĩa kiểu cho nhân viên
type Employee = {
    id: string;
    name: string;
    age: number | null;
    position: string;
    uri: string;
};

const UserManagementScreen = () => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const isManager =
        currentUser?.position && Position[currentUser.position] === 'Quản lý'
    // const userList = [
    //     { id: '1', name: 'Thomas Edison', age: 50, position: 'Lập trình viên', uri: '' },
    //     { id: '2', name: '', age: null, position: '', uri: '' },
    // ];
    const [userList, setUserList] = useState<User[]>()
    if (!isManager) {
        return (<View>
            <Text>Forbident</Text></View>)
    }
    const { refetch } = useGetUserByManagerIdQuery(currentUser.id)
    // console.log(navigation)
    useFocusEffect(
        useCallback(
            () => {
                const fetchData = async () => {
                    const response = await refetch().unwrap()
                    console.log(response[3])
                    setUserList([...response])
                }
                fetchData()
            }, [refetch]
        )
    )
    // Hàm render từng nhân viên
    const navigation = useNavigation<NavigationProp<UserManagementStackParamList>>()

    return (
        isManager &&
        <View style={styles.container}>
            {/* Header */}
            <View
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Quản lý nhân viên</Text>
                    <Text style={styles.headerSubtitle}>Danh sách nhân viên trong công ty</Text>
                </View>
            </View>

            <View style={styles.bottomComponent}>
                {/* Danh sách nhân viên */}
                <ScrollView
                    style={styles.scrollStyle}
                    contentContainerStyle={styles.scrollContent}
                >
                    {userList && userList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.employeeCard}
                            onPress={() => {

                            }}
                            activeOpacity={0.8}
                        >
                            <Avatar uri={item.avatar?.src} name={item.first_name} size={50} />
                            <View style={styles.employeeInfo}>
                                <Text style={styles.employeeName}>
                                    {item.first_name || 'Chưa có tên'}
                                </Text>
                                <Text style={styles.employeeDetail}>
                                    Ngày sinh: {item.date_of_birth || 'Chưa có thông tin'}
                                </Text>
                                <Text style={styles.employeeDetail}>
                                    Vị trí: {item.position || 'Chưa có thông tin'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* Nút Thêm nhân viên */}
                <BaseButton title='Thêm nhân viên' onPress={() =>
                    navigation.navigate('CreateUser', {
                        "manager_id": currentUser.id,
                    })
                }>
                </BaseButton>
            </View>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 40, // Thêm paddingTop để tránh bị che bởi status bar
        paddingBottom: 20,
    },
    backButton: {
        fontSize: 24,
        color: '#FFF', // Đổi màu thành trắng
        marginRight: 10,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24, // Tăng kích thước font
        fontWeight: 'bold',
        color: '#FFF', // Đổi màu thành trắng
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFF', // Đổi màu thành trắng
        marginTop: 5,
    },
    listContainer: {
        padding: 15,
    },
    employeeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    employeeInfo: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    employeeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    employeeDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    bottomComponent: {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        padding: 16,
        paddingBottom: 0,
        backgroundColor: colors.white,
        flex: 1
    },
    scrollStyle: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    scrollContent: {
        paddingBottom: 80,
    },
});

export default UserManagementScreen;