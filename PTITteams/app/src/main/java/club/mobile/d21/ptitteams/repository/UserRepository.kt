package club.mobile.d21.ptitteams.repository

import android.util.Log
import club.mobile.d21.ptitteams.model.LoginRequest
import club.mobile.d21.ptitteams.model.LoginResponse
import club.mobile.d21.ptitteams.model.RegisterRequest
import club.mobile.d21.ptitteams.model.RegisterResponse
import club.mobile.d21.ptitteams.model.User
import retrofit2.Response

class UserRepository {

    private val api = RetrofitClient.instance

    suspend fun login(email: String, password: String): LoginResponse {
        return api.login(LoginRequest(email, password))
    }

    suspend fun register(email: String, name: String, password: String): Any{
        val request = RegisterRequest(email, name, password)
        Log.d("Fuck you",request.toString())
        return api.register(request)
    }

}
