'use client';
import Login from '@/components/Login-Signup/Login';

const page = () => {
  const handleEducatorLogin = async (formData, userType) => {
    try {
      // Your educator login API call here
      const response = await fetch('/api/auth/educator-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
          userType: userType
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Store token in localStorage or cookies
      localStorage.setItem('educatorToken', data.token);
      
      // Redirect to educator dashboard
      window.location.href = '/educator/dashboard';
      
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  return (
    <Login
      userType="Educator"
      onSubmit={handleEducatorLogin}
      forgotPasswordLink="/forgot-password/educator"
      signupLink="/join-as-educator"
      redirectAfterLogin="/educator/dashboard"
    />
  );
};

export default page;