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
    val status: Int,
    val message: String,
    val userId: Int?
)
data class RegisterRequest(
    val email: String,
    val name:String,
    val password: String,
)
data class RegisterResponse(
    val id: Int,
    val company_id: Int? = null,
    val date_of_birth: String? = null,
    val first_name: String,
    val last_name: String,
    val phone: String? = null,
    val email: String,
    val user_name: String? = null,
    val position: String? = null,
    val role: String,
    val address: String? = null,
    val avatar: String? = null
)

data class UserError(
    val status: Int,
    val message: String,
    val userId: Int?
)