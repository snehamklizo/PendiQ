import React, { useState, useEffect } from 'react';
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const onCloseToast   = () => {
        setIsVisible(false);
        onClose?.();
    }

    return (
        <div className="toast toast-end z-50 w-full md:w-auto px-4 md:px-0">
            <div className={`alert alert-${type} flex gap-2 w-full md:w-auto`}>
                {type === 'danger' && <IoWarningOutline className="w-5 h-5" />}
                {type === 'success' && <IoCheckmarkCircleOutline className="w-5 h-5" />}
                <span className='flex items-center gap-2'>{message} <IoClose className="w-5 h-5 cursor-pointer" onClick={onCloseToast} /></span>
            </div>
        </div>
    );
};

export default Toast; 