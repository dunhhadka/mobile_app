package club.mobile.d21.ptitteams.model

enum class Role{
    Manager,
    Member
}
data class User(
    val id: Int,
    val name: String,
    val dob: String = "",
    val position: String = "",
    val role: Role = Role.Member,
    val email: String,
    val password: String,
    val phoneNumber: String = "",
    val companyId: String= "",
    val address: String = "",
    val image: String = "",
)
data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val status: String,
    val message: String,
    val data: User?
)
data class RegisterRequest(
    val email: String,
    val name:String,
    val password: String,
)
data class RegisterResponse(
    val status: String,
    val message: String,
    val userId: Int?
)
