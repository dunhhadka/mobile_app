package club.mobile.d21.ptitteams.model

data class Task (
    val id: Int,
    val title: String,
    val description: String,
    val processId: Int,
    val priority: String,
    val difficulty: String,
    val status: String,
    val createOn: String,
    val modifiedOn: String,
    val finishedOn: String
)