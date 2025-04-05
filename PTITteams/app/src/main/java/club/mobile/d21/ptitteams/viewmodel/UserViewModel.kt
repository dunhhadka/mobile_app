package club.mobile.d21.ptitteams.viewmodel

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import club.mobile.d21.ptitteams.model.RegisterResponse
import club.mobile.d21.ptitteams.model.User
import club.mobile.d21.ptitteams.model.UserError
import club.mobile.d21.ptitteams.repository.UserRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException
import kotlin.reflect.typeOf

class UserViewModel : ViewModel() {

    private val repository = UserRepository()

    var userIdResult = MutableLiveData<Int?>()
    val loginMessage = MutableLiveData<String>()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = repository.login(email, password)

            } catch (e: Exception) {
                loginMessage.value = "Lỗi: ${e.message}"
            }
        }
    }

    val registerMessage = MutableLiveData<String>()
    val registerUserId = MutableLiveData<Int?>()

    fun register(email: String, name: String, password: String) {
        viewModelScope.launch {
            try {
                val response = repository.register(email, name, password)
                if (response is RegisterResponse) {
                    // Xử lý khi đăng ký thành công
                    registerMessage.value = "Đăng ký thành công!"
                }
            } catch (e: HttpException) {
                val errorBody = e.response()?.errorBody()?.string()
                val errorMessage = try {
                    val json = JSONObject(errorBody)
                    json.getString("message")  // Lấy trường "message" trong JSON
                } catch (ex: Exception) {
                    "Lỗi không xác định!"
                }

                registerMessage.value = "Lỗi: $errorMessage"
            } catch (e: Exception) {
                registerMessage.value = "Lỗi hệ thống: ${e.message}"
            }
        }
    }


}
