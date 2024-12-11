import React, { useState, useEffect } from 'react';
import { ID, Query } from 'appwrite';
import { account, databases, storage } from '../lib/appwrite';
import LayoutWithSidebar from '../layouts/LayoutWithSidebar';
import { decryptData } from '../utils/encryption';
import Toast from '../components/Toast';
import { IoCheckmarkCircleOutline, IoWarningOutline  } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import VerifyUserProfile from './VerifyUserProfile';
import { MdVerified } from "react-icons/md";

const getUserId = () => {
    const encryptedId = localStorage.getItem('userId');
    if (!encryptedId) return null;
    
    return decryptData(encryptedId);
};

const Settings = () => {
    const [formData, setFormData] = useState({
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        country: '',
        password: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [apiLoading, setApiLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, icon, type = 'info') => {
        setToast({ message, icon, type });
    };

    const userId = getUserId();

    const fetchUserData = async () => {
        setApiLoading(true);
        try {
                
            const response = await databases.listDocuments(
                '67455f1a0025877bd7ef',
                '6746b723000a80a9b608',
                [Query.equal('userId', userId)], 
            );
            const userData = response.documents[response.documents.length - 1]
            if(userData){
                localStorage.setItem('userImage', userData?.imageId 
                    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/6746b8ed0001f0182f68/files/${userData.imageId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
                    : null);
                    
                    setFormData({
                        ...formData,
                        country: userData?.country || '',
                        password: '',
                        email: userData?.email,
                        image: userData?.imageId 
                            ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/6746b8ed0001f0182f68/files/${userData.imageId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
                            : ''
                });
            }
            
        } catch (err) {
            setError('Failed to load user data');
            console.error(err);
        } finally {
            setLoading(false);
            setApiLoading(false);
        }
    };

    useEffect(() => {
        
        fetchUserData();
        
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let imageId = null;
            if (formData.image instanceof File) {
                const uploadedFile = await storage.createFile(
                    '6746b8ed0001f0182f68',
                    ID.unique(),
                    formData.image
                );
                imageId = uploadedFile.$id;
            } else {
                const response = await databases.listDocuments(
                    '67455f1a0025877bd7ef',
                    '6746b723000a80a9b608',
                    [Query.equal('userId', userId)]
                );
                imageId = response.documents[0]?.imageId;
            }

            await account.updateName(formData.name);

            await databases.createDocument(
                '67455f1a0025877bd7ef',
                '6746b723000a80a9b608',
                ID.unique(),
                {
                    userId: userId,
                    name: formData.name,
                    email: formData.email,
                    country: formData.country,
                    imageId: imageId
                }
            );

            // if (formData.password) {
            //     await account.updatePassword(formData.password);
            // }

            showToast(
                'Settings updated successfully!',
                <IoCheckmarkCircleOutline />,
                'success'
            );
            fetchUserData();
        } catch (err) {
            setError(err);
            showToast(
                'Failed to update settings',
                <IoWarningOutline />,
                'danger'
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const isEmailVerified = localStorage.getItem('verifiedEmail');
    // console.log(formData);

    

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error?.message}</div>;

    return (
        <LayoutWithSidebar>
            {toast && (
                <Toast
                    message={toast.message}
                    icon={toast.icon}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {apiLoading 
                ? 
                <div className="pageLoadApi flex justify-center items-center">
                    <div className="loading loading-spinner loading-lg"></div> 
                </div>
                :  
                    <div className="p-1 md:p-4 xl:p-6">
                <h1 className="text-2xl font-bold mb-2 md:mb-6">Settings</h1>
                
                <form className="max-w-2xl space-y-4" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Profile Picture</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    {formData?.image ? 
                                        <img 
                                            src={formData?.imagePreview || formData?.image} 
                                            alt="Profile" 
                                        /> 
                                    : 
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                                <span className="text-3xl">{formData?.name?.charAt(0)}</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <input 
                                type="file" 
                                className="file-input file-input-bordered w-full max-w-xs" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

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
                            autoComplete="off"
                        />
                    </div>
                    
                    <div className='flex flex-col md:flex-row gap-3 md:items-end'> 
                        <div className="form-control w-full flex-1">
                            <div className="flex items-center gap-2 items-center">
                                <label className="label flex-1">
                                    <span className="label-text">Email </span>
                                </label>
                                {isEmailVerified && <div className='text-success text-sm flex items-center gap-1'><MdVerified />Verified</div>}
                            </div>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered"
                                disabled
                                autoComplete="off"
                            />
                        </div>
                        {!isEmailVerified && <VerifyUserProfile /> }
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Country</span>
                        </label>
                        <input 
                            type="text" 
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="input input-bordered" 
                            autoComplete="off"
                        />
                    </div>

                    {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered" 
                            placeholder="Leave blank to keep current password"
                            autoComplete="new-password"
                        />
                    </div> */}

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'} {loading && <span className="loading loading-spinner loading-sm"></span>}
                    </button>
                    <p className='mt-3'>Want to change your password? <Link to={`/recovery/${btoa(formData?.email || '').replace(/[^a-zA-Z0-9]/g, '')}`} className='link link-primary' target='_blank'>Reset password</Link></p>
                </form>
                </div>
            }
        </LayoutWithSidebar>
    )
}

export default Settings 