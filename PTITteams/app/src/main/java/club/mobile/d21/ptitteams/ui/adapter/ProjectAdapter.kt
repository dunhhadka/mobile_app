package club.mobile.d21.ptitteams.ui.adapter
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import club.mobile.d21.ptitteams.R
import club.mobile.d21.ptitteams.databinding.ProjectItemBinding
import club.mobile.d21.ptitteams.model.Project

class ProjectAdapter(
    val listProject: List<Project>): RecyclerView.Adapter<ProjectAdapter.ProjectViewHolder>(){
    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ProjectViewHolder {
        val projectViewLayout = ProjectItemBinding.inflate(LayoutInflater.from(parent.context), parent, false).root
        return ProjectViewHolder(projectViewLayout)
    }

    override fun onBindViewHolder(
        holder: ProjectViewHolder,
        position: Int
    ) {
        val projectItem = listProject[position]
        holder.projectName.text = projectItem.title
        holder.projectDescription.text = projectItem.description
        holder.projectTask.text = projectItem.tasks.size.toString()
        holder.projectStartDate.text = projectItem.startOn
    }

    override fun getItemCount(): Int {
        return listProject.size
    }

    class ProjectViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val projectName: TextView = itemView.findViewById(R.id.project_name)
        val projectDescription: TextView = itemView.findViewById(R.id.project_description)
        val projectStartDate: TextView = itemView.findViewById(R.id.project_start_date )
        val projectTask: TextView = itemView.findViewById(R.id.project_task)
    }
}