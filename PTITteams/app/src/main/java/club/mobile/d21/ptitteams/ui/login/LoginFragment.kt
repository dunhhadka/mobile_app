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
import club.mobile.d21.ptitteams.databinding.FragmentLoginBinding
import club.mobile.d21.ptitteams.ui.MainActivity
import club.mobile.d21.ptitteams.viewmodel.UserViewModel

class LoginFragment : Fragment() {
    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    private val viewModel: UserViewModel by activityViewModels()

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
            val email = binding.emailTextInput.text.toString().trim()
            val password = binding.passwordInput.text.toString()

            if (validateInputs(email, password)) {
                viewModel.login(email, password)
            }
        }

        viewModel.loginMessage.observe(viewLifecycleOwner, Observer { message ->
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        })

        viewModel.userResult.observe(viewLifecycleOwner, Observer { user ->
            if (user != null) {
                val intent = Intent(requireActivity(), MainActivity::class.java).apply {
                    putExtra("UserID", user.id)
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

    private fun validateInputs(email: String, password: String): Boolean {
        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return false
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(context, "Invalid email format", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }
}
