import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Logo from '../Miscellaneous/Logo';
import Toast from '../components/Toast';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Client, Account } from "appwrite"
import { account } from '../lib/appwrite';

const client = new Client()
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

const NewPassword = () => {
  const [formData, setFormData] = useState({
    password: ''
  })
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const showToast = (message, icon, type) => {
    setToast({ message, icon, type });
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
  
  const urlParams = new URLSearchParams(window.location.search);
  const userPassId = urlParams.get('userId');
  if (!userPassId) {
    showToast('Invalid URL: userId not found', null, 'danger');
    return;
  }
  console.log(userPassId);

  const secretId = urlParams.get('secret');
  if (!secretId) {
    showToast('Invalid URL: secret not found', null, 'danger');
    return;
  }
  console.log(secretId);

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if(formData.password.length < 8){
      showToast('Password length must be at least 8 characters', null, 'danger');
      return;
    }
    else{
        console.log(formData);
        setLoading(true);
        const promise = account.updateRecovery(
            userPassId,
            secretId,
            formData.password,
            formData.password
        );
        
        promise.then(function (response) {
            console.log(response); 
            showToast('Password updated successfully', null, 'success');
            setLoading(false);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }, function (error) {
            console.log(error);
            showToast('Something went wrong. try again later', null, 'danger');
            setLoading(false);
        });
    }
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
            <h2 className="card-title">Enter your new password</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className='relative'>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="password"
                    name="password" 
                    className="input input-bordered w-full pr-8" 
                    value={formData.password}
                    onChange={handleChange}
                    required 
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
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={loading}>Submit {loading && <span className="loading loading-spinner"></span>}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NewPassword