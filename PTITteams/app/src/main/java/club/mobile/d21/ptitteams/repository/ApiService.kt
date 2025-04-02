package club.mobile.d21.ptitteams.repository

import club.mobile.d21.ptitteams.model.LoginRequest
import club.mobile.d21.ptitteams.model.LoginResponse
import club.mobile.d21.ptitteams.model.RegisterRequest
import club.mobile.d21.ptitteams.model.RegisterResponse
import club.mobile.d21.ptitteams.model.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("api/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>


    @POST("api/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

}
