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
import club.mobile.d21.ptitteams.databinding.FragmentRegisterBinding
import club.mobile.d21.ptitteams.ui.MainActivity

class RegisterFragment : Fragment() {
    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.toLogin.setOnClickListener {
            findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
        }
        binding.signUpButton.setOnClickListener {
            val email = binding.emailTextInput.text.toString()
            val phone = binding.phoneTextInput.text.toString()
            val password = binding.passwordTextInput.text.toString()
            val confirmPassword = binding.confirmPasswordTextInput.text.toString()
            if (email != "" && phone != "" && password != "" && confirmPassword != "") {
                if (password == confirmPassword) {
                    createUser(email, phone, password)
                    val intent = Intent(requireActivity(), MainActivity::class.java).apply {
                        putExtra("EMAIL", email)
                    }
                    startActivity(intent)
                    requireActivity().finish()
                } else {
                    Toast.makeText(context, "Password doesn't match", Toast.LENGTH_SHORT).show()
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

    private fun createUser(email: String, phoneNumber: String, password: String) {

    }
}