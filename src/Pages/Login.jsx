import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Logo from '../Miscellaneous/Logo';
import { account, ID } from '../lib/appwrite';
import Toast from '../components/Toast';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { encryptData } from '../utils/encryption';
import { fetchUserImage } from '../utils/fetchUserImage';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, icon, type) => {
    setToast({ message, icon, type });
  };

  

  async function login(email, password) {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      
      const user = await account.get();
      const encryptedUserId = encryptData(user.$id);
      showToast(
        'Login successful',
          null,
          'success'
      );
      setLoading(false);
      setLoggedInUser(user);
      localStorage.setItem('userId', encryptedUserId);
      localStorage.setItem('blockAuth', 'true');
      localStorage.setItem('userName', user?.name);
      localStorage.setItem('userEmail', user?.email);
      const userEmailverified = user?.emailVerification;
      if(userEmailverified){
        localStorage.setItem('verifiedEmail', 'true');
      }
      fetchUserImage(user.$id);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      showToast(
        error?.message,
          null,
          'danger'
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData.email, formData.password);
  }

  return (
    <Layout>
      {toast && <Toast message={toast?.message} icon={toast?.icon} type={toast?.type} onClose={() => setToast(null)} />}
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl glass">
          <div className="card-body">
            <div className="siteLogo mb-2">
              <Logo width={'200px'} height={'auto'} stroke="#0000FF" fill="var(--logoColor)" />
            </div>
            <h2 className="card-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="email" 
                  className="input input-bordered" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  placeholder="password" 
                  className="input input-bordered w-full pr-8" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  </span>
                </div>
              </div>
              <label className="label">
                <Link to={`/recovery/${btoa('dummy@gmail.com' || '').replace(/[^a-zA-Z0-9]/g, '')}`} className='link link-primary text-sm text-decoration-none'>Forgot password?</Link>
              </label>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={loading}>Login {loading && <span className="loading loading-spinner"></span>}</button>
                <p className='mt-3'>don't have an account? <Link to="/signup">Sign up</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login