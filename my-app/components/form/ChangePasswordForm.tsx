import React, { useCallback, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Lock } from "lucide-react-native";
import colors from "../../constants/colors";
import { TaskActionButton } from "../buttons/TaskActionButton";
import { useForm } from "react-hook-form";
import ConfirmModal from "../card/ConfirmModal";
import { useChangePasswordMutation } from "../../api/magementApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loading from "../loading/Loading";
import { ChangePasswordRequest } from "../../types/management";
import { useToast } from "react-native-toast-notifications";
import { setUser } from "../../redux/slices/userSlice";

interface Props {
    onColose: () => void
}

const ChangePasswordForm = ({ onColose }: Props) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showConfirmChangeModal, setShowConfirmModal] = useState(false);

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [changePassword, { isLoading: isChangeLoading }] = useChangePasswordMutation();

    const [errors, setErrors] = useState<string>();

    const dispatch = useDispatch();

    const toast = useToast()

    const handleChangePassword = async () => {

        if(newPassword !== confirmPassword) {
            setErrors("Mật khẩu mới và xác nhận mật khẩu không khớp.")
            setShowConfirmModal(false);
            return
        }

        try {
            const request: ChangePasswordRequest & { userId: number } = {
                ...{
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                userId: currentUser?.id || 0,
            };
            console.log(request);
            const user = await changePassword(request).unwrap();
            dispatch(setUser(user));
            onColose()
            toast.show("Đổi mật khẩu thành công", { type: "success", duration: 4000 });
            setErrors(undefined)
        } catch (err: any) {
            console.log(err);
            setErrors(err?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại!");
        }

        // Handle password change logic here
        console.log("Old Password:", oldPassword);
        setShowConfirmModal(false);
    }
    return (
        <View style={styles.container}>
            {
                errors && (
                    <Text style={{ color: colors.danger, marginBottom: 10 }}>{errors}</Text>
                )
            }
            <View style={styles.inputContainer}>
                <Lock color={colors.primary} size={20} />
                <TextInput
                    placeholder="Mật khẩu cũ"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setOldPassword}
                    value={oldPassword}
                />
            </View>

            <View style={styles.inputContainer}>
                <Lock color={colors.primary} size={20} />
                <TextInput
                    placeholder="Mật khẩu mới"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setNewPassword}
                    value={newPassword}
                />
            </View>

            <View style={styles.inputContainer}>
                <Lock color={colors.primary} size={20} />
                <TextInput
                    placeholder="Xác nhận mật khẩu mới"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                />
            </View>

            {
                isChangeLoading && (
                    <Loading />
                )
            }

            <TaskActionButton
                onClick={() => setShowConfirmModal(true)}
                action={"Thay đổi mật khẩu"}
                showIcon={false} />

            {
                showConfirmChangeModal && (
                    <ConfirmModal open={showConfirmChangeModal}
                        onCancel={() => setShowConfirmModal(false)}
                        onConfirm={handleChangePassword} />
                )
            }
        </View>
    );
};

export default ChangePasswordForm;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.background,
        flex: 1,
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.greyLight,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: colors.textPrimary,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
