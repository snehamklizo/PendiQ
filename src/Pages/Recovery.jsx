import React, { useLayoutEffect, useState } from 'react'
import Logo from '../Miscellaneous/Logo';
import { Client, Account } from "appwrite"
import { account } from '../lib/appwrite';
import Toast from '../components/Toast';

const client = new Client()
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

const Recovery = () => {
    const [formData, setFormData] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordSession, setPasswordSession] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, icon, type) => {
        setToast({ message, icon, type });
    };

    const userPassId = window.location.pathname.split('/')[2];
    console.log(userPassId);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const promise = account.createRecovery(formData?.email, `${import.meta.env.VITE_APP_LINK}/new-password/${userPassId}`);

        promise.then(function (response) {
            console.log(response);
            if(response){
                setPasswordSession(true);
            } 
        }, function (error) {
            console.log(error); 
            showToast(
                error?.message,
                  null,
                  'danger'
            );
        });
        setLoading(false);
    }
    useLayoutEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.querySelector('html').dataset.theme = theme;
        }
        const userMail = localStorage.getItem('userEmail');
        if (userMail) {
            setFormData({ email: userMail });
        }
      }, []);
  return (
    <div className="recovery_email_div">
    {toast && <Toast message={toast?.message} icon={toast?.icon} type={toast?.type} onClose={() => setToast(null)} />}
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl glass">
          <div className="card-body">
            <div className="siteLogo mb-2">
              <Logo width={'200px'} height={'auto'} stroke="#0000FF" fill="var(--logoColor)" />
            </div>
            {passwordSession ? (
                <div>
                    <h2 className="card-title mb-2">We have received your request</h2>
                    <p>Check your email for the Password Reset Link</p>
                    <small>Note: The link will be valid for 1 hour</small>
                </div>
            ) : (
                <div>
                    <h2 className="card-title">Enter your email to reset your password</h2>
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
                <div className="form-control mt-6">
                    <button className="btn btn-primary" disabled={loading} type='submit'>Next {loading && <span className="loading loading-spinner"></span>}</button>
                </div>
                </form>
                </div>
            )}
          </div>
        </div>
    </div>
    </div>
  )
}

export default Recovery