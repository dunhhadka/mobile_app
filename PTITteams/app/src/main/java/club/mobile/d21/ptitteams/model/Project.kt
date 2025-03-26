package club.mobile.d21.ptitteams.model

data class Project(
    val id: Int,
    val company: Int,
    val title: String,
    val description: String,
    val createdOn: String,
    val startOn: String,
    val modifiedOn: String,
    val status: String,
    val tasks: List<Task>
)