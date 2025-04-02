package club.mobile.d21.ptitteams.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import club.mobile.d21.ptitteams.R
import club.mobile.d21.ptitteams.databinding.OnboardingScreenBinding
import club.mobile.d21.ptitteams.model.OnboardingItem
import club.mobile.d21.ptitteams.ui.adapter.OnboardingAdapter

class OnboardingActivity : AppCompatActivity() {
    private lateinit var binding: OnboardingScreenBinding
    private lateinit var adapter: OnboardingAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = OnboardingScreenBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val onboardingItems = listOf(
            OnboardingItem(R.drawable.today_meeting,R.drawable.today_task, "Welcome to Workmate!", "Make Smart Decisions! Set clear timelines for projects and celebrate your achievements!"),
            OnboardingItem(R.drawable.working_period, R.drawable.working_level, "Manage Stress Effectively", "Stay Balanced! Track your workload and maintain a healthy stress level with ease."),
            OnboardingItem(R.drawable.achieviement, R.drawable.today_task, "Plan for Success", "Your Journey Starts Here! Earn achievement badges as you conquer your tasks.")
        )

        // Gán adapter cho ViewPager2
        adapter = OnboardingAdapter(onboardingItems)
        binding.viewPager.adapter = adapter

        // Xử lý nút Next
        binding.nextButton.setOnClickListener {
            val currentItem = binding.viewPager.currentItem
            if (currentItem < onboardingItems.size - 1) {
                binding.viewPager.currentItem = currentItem + 1
            } else {
                //navigateToLoginScreen()
                navigateToMainScreen()
            }
        }

        // Xử lý nút Skip
        binding.skipButton.setOnClickListener {
            //navigateToLoginScreen()
            navigateToMainScreen()
        }
    }

    private fun navigateToLoginScreen() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
    private fun navigateToMainScreen(){
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("UserID", "Test")
        }
        startActivity(intent)
        finish()
    }
}
