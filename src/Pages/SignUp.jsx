import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Logo from '../Miscellaneous/Logo';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import { encryptData } from '../utils/encryption';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        formData.name
      );

      await account.createEmailPasswordSession(formData.email, formData.password);
      const encryptedUserId = encryptData(response.$id);
      localStorage.setItem('userId', encryptedUserId);
      localStorage.setItem('blockAuth', 'true');
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userEmail', response.email);
      
      navigate('/dashboard');
    } catch (error) {
      localStorage.removeItem('blockAuth');

    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 1: return 'progress-error';
      case 2: return 'progress-warning';
      case 3: return 'progress-info';
      case 4: return 'progress-success';
      default: return 'progress-error';
    }
  };

  return (
    <Layout>  
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="siteLogo mb-2">
            <Logo width={'200px'} height={'auto'} stroke="#0000FF" fill="var(--logoColor)" />
          </div>
          <h1 className="text-xl font-bold">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered"
                required
                minLength={2}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pr-8"
                  required
                  minLength={8}
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
              </div>
              <div className="mt-2">
                <progress
                  className={`progress w-full ${getPasswordStrengthClass()}`}
                  value={passwordStrength}
                  max="4"
                ></progress>
                <label className="label">
                  <span className="label-text-alt">
                    {passwordStrength === 0 && 'Enter password'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Fair'}
                    {passwordStrength === 3 && 'Good'}
                    {passwordStrength === 4 && 'Strong'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'} {loading && <span className="loading loading-spinner"></span>}
            </button>
            <p>already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default SignUp; 