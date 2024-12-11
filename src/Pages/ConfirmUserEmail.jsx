import React, { useState } from 'react'
import Layout from '../layouts/Layout'
import Logo from '../Miscellaneous/Logo'
import Toast from '../components/Toast'
import { Client, Account } from "appwrite";
import {account} from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const client = new Client()
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

const ConfirmUserEmail = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, icon, type) => {
    setToast({ message, icon, type })
  }

  const navigate = useNavigate();

  const handleConfirmEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    const promise = account.updateVerification(userId, secret);

    promise.then(function (response) {
        console.log(response); 
        showToast('Email confirmed successfully', null, 'success');
        localStorage.setItem('verifiedEmail', 'true');
        setTimeout(() => {
          window.location.href = '/settings';
        }, 1000);
    }, function (error) {
        console.log(error); 
        showToast(error?.message, null, 'danger');
    });
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
            <h2 className="card-title">Confirm Your Email</h2>
            <p className="text-sm mt-2">
              Please click the button below to confirm your email address.
            </p>
            <form onSubmit={handleConfirmEmail}>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={loading}>
                  Confirm Email {loading && <span className="loading loading-spinner"></span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ConfirmUserEmail