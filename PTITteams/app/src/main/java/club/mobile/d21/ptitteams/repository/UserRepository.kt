package club.mobile.d21.ptitteams.repository

import club.mobile.d21.ptitteams.model.LoginRequest
import club.mobile.d21.ptitteams.model.LoginResponse
import club.mobile.d21.ptitteams.model.RegisterRequest
import club.mobile.d21.ptitteams.model.RegisterResponse
import club.mobile.d21.ptitteams.model.User
import retrofit2.Response

class UserRepository {

    private val api = RetrofitClient.instance

    suspend fun login(email: String, password: String): Response<LoginResponse> {
        return api.login(LoginRequest(email, password))
    }

    suspend fun register(email: String, name: String, password: String): Response<RegisterResponse> {
        val request = RegisterRequest(email,name, password)
        return api.register(request)
    }

}
