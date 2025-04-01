package club.mobile.d21.ptitteams.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import club.mobile.d21.ptitteams.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}