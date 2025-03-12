package club.mobile.d21.ptitteams.ui.login

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import club.mobile.d21.ptitteams.R
import club.mobile.d21.ptitteams.databinding.FragmentForgotPasswordBinding

class ForgotPasswordFragment: Fragment() {
    private var _binding : FragmentForgotPasswordBinding?=null
    private val binding get()= _binding!!
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentForgotPasswordBinding.inflate(inflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.toLogin.setOnClickListener{
            findNavController().navigate(R.id.action_forgotPasswordFragment_to_loginFragment)
        }
        binding.sendEmailButton.setOnClickListener{
            val email = binding.emailTextInput.text.toString()
            if(email!=""){
                sendEmail(email)
            }else{
                Toast.makeText(context,"Please enter your email to verify",Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
    private fun sendEmail(email: String){

    }
}