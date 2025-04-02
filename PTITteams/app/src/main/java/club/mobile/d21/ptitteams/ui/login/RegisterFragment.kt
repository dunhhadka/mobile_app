package club.mobile.d21.ptitteams.ui.login

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import club.mobile.d21.ptitteams.R
import club.mobile.d21.ptitteams.databinding.FragmentRegisterBinding
import club.mobile.d21.ptitteams.ui.MainActivity
import club.mobile.d21.ptitteams.viewmodel.UserViewModel

class RegisterFragment : Fragment() {
    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!

    private val viewModel: UserViewModel by activityViewModels()

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
            val email = binding.emailTextInput.text.toString().trim()
            val name = binding.nameTextInput.text.toString().trim()
            val password = binding.passwordTextInput.text.toString()
            val confirmPassword = binding.confirmPasswordTextInput.text.toString()

            if (validateInputs(email, name, password, confirmPassword)) {
                createUser(email, name, password)
            }
        }

        viewModel.registerMessage.observe(viewLifecycleOwner, Observer { message ->
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        })

        viewModel.registerUserId.observe(viewLifecycleOwner, Observer { userId ->
            if (userId != null) {
                // Thành công → vào app chính
                val intent = Intent(requireActivity(), MainActivity::class.java).apply {
                    putExtra("UserID", userId)
                }
                startActivity(intent)
                requireActivity().finish()
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun validateInputs(email: String, name: String, password: String, confirmPassword: String): Boolean {
        if (email.isEmpty() || name.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return false
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(context, "Invalid email format", Toast.LENGTH_SHORT).show()
            return false
        }

        if (password.length < 6 || !password.any { it.isDigit() } || !password.any { it.isLetter() }) {
            Toast.makeText(
                context,
                "Password must be at least 6 characters, including letters and numbers",
                Toast.LENGTH_SHORT
            ).show()
            return false
        }

        if (password != confirmPassword) {
            Toast.makeText(context, "Passwords do not match", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }

    private fun createUser(email: String, name: String, password: String) {
        viewModel.register(email, name, password)
    }
}
