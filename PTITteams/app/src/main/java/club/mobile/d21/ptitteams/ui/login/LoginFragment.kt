package club.mobile.d21.ptitteams.ui.login

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import club.mobile.d21.ptitteams.R
import club.mobile.d21.ptitteams.databinding.FragmentLoginBinding
import club.mobile.d21.ptitteams.ui.MainActivity

class LoginFragment : Fragment() {
    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.toRegister.setOnClickListener {
            findNavController().navigate(R.id.action_loginFragment_to_registerFragment)
        }
        binding.forgotPasswordText.setOnClickListener {
            findNavController().navigate(R.id.action_loginFragment_to_forgotPasswordFragment)
        }
        binding.signInButton.setOnClickListener {
            val email = binding.emailTextInput.text.toString()
            val password = binding.passwordInput.text.toString()
            if (email != "" && password != "") {
                if (authenticateUser(email, password)) {
                    val intent = Intent(requireActivity(), MainActivity::class.java).apply {
                        putExtra("EMAIL", email)
                    }
                    startActivity(intent)
                    requireActivity().finish()
                }
            } else {
                Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }

        }
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }

    private fun authenticateUser(email: String, password: String): Boolean {
        return true
    }
}