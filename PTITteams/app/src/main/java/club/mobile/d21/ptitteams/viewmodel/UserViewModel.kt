package club.mobile.d21.ptitteams.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import club.mobile.d21.ptitteams.model.User
import club.mobile.d21.ptitteams.repository.UserRepository
import kotlinx.coroutines.launch

class UserViewModel : ViewModel() {

    private val repository = UserRepository()

    val userResult = MutableLiveData<User?>()
    val loginMessage = MutableLiveData<String>()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = repository.login(email, password)
                if (response.isSuccessful) {
                    val body = response.body()
                    loginMessage.value = body?.message ?: "Unknown response"
                    if (body?.status == "success") {
                        userResult.value = body.data
                    } else {
                        userResult.value = null
                    }
                } else {
                    loginMessage.value = "Lỗi mạng hoặc server: ${response.code()}"
                }
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
                if (response.isSuccessful) {
                    val body = response.body()
                    registerMessage.value = body?.message ?: "Unknown response"
                    if (body?.status == "success") {
                        registerUserId.value = body.userId
                    } else {
                        registerUserId.value = null
                    }
                } else {
                    registerMessage.value = "Lỗi mạng hoặc server: ${response.code()}"
                }
            } catch (e: Exception) {
                registerMessage.value = "Lỗi: ${e.message}"
            }
        }
    }

}
