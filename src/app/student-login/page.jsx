'use client';

import Login from '@/components/Login-Signup/Login';

const page = () => {
  const handleStudentLogin = async (formData, userType) => {
    try {
      // Your student login API call here
      const response = await fetch('/api/auth/student-login', {
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
      localStorage.setItem('studentToken', data.token);
      
      // Redirect to student dashboard
      window.location.href = '/student/dashboard';
      
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  return (
    <Login
      userType="Student"
      onSubmit={handleStudentLogin}
      forgotPasswordLink="/forgot-password/student"
      signupLink="/join-as-student"
      redirectAfterLogin="/student/dashboard"
    />
  );
};

export default page;
