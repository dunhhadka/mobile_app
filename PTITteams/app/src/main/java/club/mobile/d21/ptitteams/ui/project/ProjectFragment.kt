package club.mobile.d21.ptitteams.ui.project

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.recyclerview.widget.LinearLayoutManager
import club.mobile.d21.ptitteams.databinding.FragmentProjectBinding
import club.mobile.d21.ptitteams.model.Project
import club.mobile.d21.ptitteams.model.Task
import club.mobile.d21.ptitteams.ui.adapter.ProjectAdapter

class ProjectFragment : Fragment() {
    private var _binding: FragmentProjectBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: ProjectAdapter
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProjectBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val dataTest = listOf(
            Project(
                id = 1,
                company = 101,
                title = "Project Alpha",
                description = "AI Development",
                createdOn = "2024-01-01",
                startOn = "2024-02-01",
                modifiedOn = "2024-03-01",
                status = "In Progress",
                tasks = listOf(
                    Task(1, "Task 1", "Setup environment", 1001, "High", "Medium", "Pending", "2024-01-10", "2024-01-11", "2024-02-01"),
                    Task(2, "Task 2", "Train model", 1001, "Medium", "Hard", "In Progress", "2024-01-15", "2024-01-16", "")
                )
            ),
            Project(
                id = 2,
                company = 102,
                title = "Project Beta",
                description = "Mobile App",
                createdOn = "2024-02-01",
                startOn = "2024-02-15",
                modifiedOn = "2024-03-10",
                status = "Pending",
                tasks = listOf(
                    Task(3, "Task 1", "Design UI", 1002, "High", "Medium", "Pending", "2024-02-05", "2024-02-06", ""),
                    Task(4, "Task 2", "Develop backend", 1002, "Medium", "Hard", "Pending", "2024-02-10", "2024-02-11", "")
                )
            ),
            Project(
                id = 3,
                company = 103,
                title = "Project Gamma",
                description = "E-commerce Platform",
                createdOn = "2024-03-01",
                startOn = "2024-03-15",
                modifiedOn = "2024-03-20",
                status = "In Progress",
                tasks = listOf(
                    Task(5, "Task 1", "Setup database", 1003, "Medium", "Medium", "In Progress", "2024-03-05", "2024-03-06", ""),
                    Task(6, "Task 2", "Implement payment", 1003, "High", "Hard", "Pending", "2024-03-10", "2024-03-11", "")
                )
            ),
            Project(
                id = 4,
                company = 104,
                title = "Project Delta",
                description = "IoT System",
                createdOn = "2024-04-01",
                startOn = "2024-04-15",
                modifiedOn = "2024-04-20",
                status = "Pending",
                tasks = listOf(
                    Task(7, "Task 1", "Setup hardware", 1004, "High", "Hard", "Pending", "2024-04-05", "2024-04-06", ""),
                    Task(8, "Task 2", "Develop firmware", 1004, "Medium", "Medium", "Pending", "2024-04-10", "2024-04-11", "")
                )
            ),
            Project(
                id = 5,
                company = 105,
                title = "Project Epsilon",
                description = "Blockchain App",
                createdOn = "2024-05-01",
                startOn = "2024-05-15",
                modifiedOn = "2024-05-20",
                status = "In Progress",
                tasks = listOf(
                    Task(9, "Task 1", "Design architecture", 1005, "High", "Hard", "In Progress", "2024-05-05", "2024-05-06", ""),
                    Task(10, "Task 2", "Smart contract", 1005, "Medium", "Hard", "Pending", "2024-05-10", "2024-05-11", "")
                )
            ),
            Project(6, 106, "Project Zeta", "Big Data Analysis", "2024-06-01", "2024-06-15", "2024-06-20", "Pending", emptyList()),
            Project(7, 107, "Project Eta", "Machine Learning", "2024-07-01", "2024-07-15", "2024-07-20", "In Progress", emptyList()),
            Project(8, 108, "Project Theta", "Cybersecurity", "2024-08-01", "2024-08-15", "2024-08-20", "Completed", emptyList()),
            Project(9, 109, "Project Iota", "Social Network", "2024-09-01", "2024-09-15", "2024-09-20", "In Progress", emptyList()),
            Project(10, 110, "Project Kappa", "Cloud Computing", "2024-10-01", "2024-10-15", "2024-10-20", "Pending", emptyList())
        )
        adapter = ProjectAdapter(dataTest)
        binding.projectListView.adapter = adapter
        binding.projectListView.layoutManager = LinearLayoutManager(context)
    }
    override fun onDestroy() {
        super.onDestroy()
        _binding=null
    }


}