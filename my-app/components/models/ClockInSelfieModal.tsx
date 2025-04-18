import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { useUploadLogMutation } from '../../api/magementApi'; // Đường dẫn đúng của mutation
import { User } from '../../types/management';
import * as Location from 'expo-location'
import MapView, { Circle, Marker } from 'react-native-maps';
import BaseButton from './BaseButton';
interface Props {
    user: User
    clockInState: boolean;
    onClose?: () => void;
}

const ClockInSelfieModal: React.FC<Props> = ({ user, clockInState, onClose }) => {
    const [note, setNote] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [clockIn] = useUploadLogMutation();
    const dispatch = useDispatch();
    const toast = useToast();
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                alert('Permission to access location was denied')
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setLocation(location.coords)
        })()
    }, [])

    const handlePickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                toast.show('Camera permission denied', { type: 'danger' });
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: false,
            });

            if (result.canceled) return;

            const asset = result.assets?.[0];
            if (asset) {
                setPhoto(asset.uri);
            }
        } catch (error) {
            console.error('Error in handlePickImage:', error);
        }
    };

    const handleClockIn = async () => {
        /* To Do call api */
        if (!photo) {
            toast.show('Please take a photo before clocking in', { type: 'warning' });
            return;
        }

        const formData = new FormData();
        try {
            if (user.avatar === undefined) throw new Error("Người dùng chưa cập nhật avatar");
            formData.append('checkIn', new Date().toISOString());
            formData.append('type', 'in');
            formData.append('logImage', {
                uri: photo,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);
            formData.append('imageId', user.avatar.id.toString());
            formData.append('note', note);
            if(location == undefined){
                throw new Error("Xin chờ cập nhật vị trí");
            }
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());
            formData.append('userId', user.id.toString());
            try {
                const response = await clockIn(formData).unwrap();
                toast.show('Clock In successful!', { type: 'success' });
                onClose?.();
            } catch (error) {
                // console.error('Clock In failed:', error);
                toast.show('Clock In failed', { type: 'danger' });
            }
        } catch (error) {
            toast.show('Bạn chưa cập nhật avatar');
        }
    };

    return (
        <ScrollView style={styles.boundary} contentContainerStyle={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: location?.latitude ?? 0,
                    longitude: location?.longitude ?? 0,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                showsUserLocation={true}
            >
                <Marker
                    coordinate={{
                        latitude: location?.latitude ?? 0,
                        longitude: location?.longitude ?? 0,
                    }}
                    title="Bạn đang ở đây"
                    description="Vị trí hiện tại"
                />
                <Circle
                    center={{
                        latitude: location?.latitude ?? 0,
                        longitude: location?.longitude ?? 0,
                    }}
                    radius={100}
                    strokeColor="#A020F0"
                    fillColor="rgba(160, 32, 240, 0.2)"
                />
            </MapView>
            <View style={styles.modal}>
                <Text style={styles.title}>Take Selfie to Clock In</Text>

                {photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                ) : (
                    <TouchableOpacity onPress={handlePickImage}>
                        <Image
                            source={require('../../assets/user-clock-in.png')}
                            style={styles.infoImage}
                        />
                    </TouchableOpacity>
                )}

                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ghi chú"
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                <BaseButton title='Điểm danh' onPress={handleClockIn} key='clockInButton' />
            </View>
        </ScrollView>
    );
};

export default ClockInSelfieModal;
const styles = StyleSheet.create({
    boundary: {
        width: "100%"
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        color: '#4B0082', // màu tím đậm
    },
    photo: {
        width: 240,
        height: 300,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#A020F0',
    },
    info: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        textAlign: 'center',
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 6,
        fontSize: 14,
        color: '#6B6B6B',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        height: 90,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
        fontSize: 14,
        backgroundColor: '#F9F9F9',
    },
    clockInButton: {
        backgroundColor: '#A020F0',
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 32,
        shadowColor: '#A020F0',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    clockInText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    map: {
        flexGrow: 1,
        width: "100%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoImage: {
        width: 100,
        height: 100,
        resizeMode: 'center'
    },
})
