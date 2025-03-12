package club.mobile.d21.ptitteams.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import club.mobile.d21.ptitteams.databinding.ActivityLoginBinding

class LoginActivity: AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}