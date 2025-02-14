import React, { useLayoutEffect, useState } from 'react'
import { Client, Account } from "appwrite";
import {account} from '../lib/appwrite';
import Toast from '../components/Toast';

const client = new Client()
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

const VerifyUserProfile = () => {

  const[toast, setToast] = useState(null);
  const [verifyActive, setVerifyActive] = useState(false);

  const showToast = (message, icon, type) => {
    setToast({ message, icon, type });
  };
  const confirmCode = btoa(localStorage.getItem('userId') || '').replace(/[^a-zA-Z0-9]/g, '');
  console.log(confirmCode);

    const handleVerifyEmail = () => {
        setVerifyActive(true);
        const account = new Account(client);

        const appLink = import.meta.env.VITE_APP_LINK;
        const validHosts = ['localhost', 'cloud.appwrite.io', 'appwrite.io', '*.appwrite.io', 'pendiq.vercel.app'];
        const url = new URL(appLink);
        
        if (!validHosts.some(host => url.host.endsWith(host))) {
            showToast('Invalid URL host', null, 'danger');
            setVerifyActive(false);
            return;
        }

        const promise = account.createVerification(`${appLink}/confirm-email/${confirmCode ? confirmCode : 'xxxx'}`);

        promise.then(function (response) {
            // console.log(response);
            document.getElementById('my_modal_1').showModal();
        }, function (error) {
            console.log(error); 
            showToast(error?.message, null, 'danger');
        });
    }

    const handleVerifyRefresh = async() => {
        setVerifyActive(true);
        const user = await account.get();
        console.log(user?.emailVerification);
        const isEmailVerified = user?.emailVerification;
        if(isEmailVerified){
          localStorage.setItem('verifiedEmail', 'true');
          setTimeout(() => {
            setVerifyActive(false);
            window.location.href = '/settings';
          }, 300);
        }
        else {
          showToast('Email not verified', null, 'danger');
          setVerifyActive(false);
        }
    }

    useLayoutEffect(() => {
      const verifiedEmail = localStorage.getItem('verifiedEmail');
      if(verifiedEmail){
        setVerifyActive(true);
      }
    }, []);

  return (
    <div className='verify-profile'>
        {toast && <Toast message={toast?.message} icon={toast?.icon} type={toast?.type} onClose={() => setToast(null)} />}
        <div className="tooltip" data-tip="Verify Profile">
          <button className='btn btn-success text-white' disabled={verifyActive} type='button' style={{fontSize: '14px', borderRadius: '5px'}} onClick={handleVerifyEmail}>Verify Email {verifyActive && <span className="loading loading-spinner loading-sm"></span>}</button> 
          {verifyActive && <button className='btn btn-success ms-3 text-white'  type='button' style={{fontSize: '14px', borderRadius: '5px'}} onClick={handleVerifyRefresh}>Refresh</button>}
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Nice!</h3>
            <p className="py-4">We have sent you a verification link to your email address. Please check your email and verify your account.</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
    </div>
  )
}

export default VerifyUserProfile