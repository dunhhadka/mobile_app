import { LinearGradient } from 'expo-linear-gradient'
import {
    ActivityIndicator,
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native'
import colors from '../../constants/colors'

interface Props {
    isLoading?: boolean
    onPress?: () => void
    title: string
    colorButtonStart?: string
    colorButtonEnd?: string
    colorText?: string
    colorBorder?: string
}

export default function WorkButton({
    isLoading = false,
    colorButtonStart = '#7B5AFF',
    colorButtonEnd = '#4D66F4',
    colorBorder=colors.primary,
    colorText = colors.white,
    title,
    onPress,
}: Props) {
    return (
        <TouchableOpacity
            style={[styles.buttonWrapper, {borderColor: colorBorder}]}
            onPress={onPress}
            disabled={isLoading}
        >
            <LinearGradient colors={[colorButtonStart, colorButtonEnd]} style={styles.button}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={colorText} />
                ) : (
                    <Text style={[styles.buttonText,{color:colorText}]}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: {
        marginHorizontal: '3%',
        borderWidth: 2,
        borderRadius: 30,
        overflow: 'hidden',
        width: '40%',
    } as ViewStyle,
    button: {
        // marginTop: 20,
        // paddingVertical: 12,
        // paddingHorizontal: 24,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    } as ViewStyle,
    inActiveButton: {
        backgroundColor: '#ccc', // Màu xám để hiển thị button bị vô hiệu hóa
        opacity: 0.6,             // Làm mờ một chút
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
    } as ViewStyle
    ,
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    } as TextStyle,
})
