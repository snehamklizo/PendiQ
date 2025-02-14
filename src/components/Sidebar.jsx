import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdChecklist, MdOutlineStackedLineChart, MdSettings } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Logo from '../Miscellaneous/Logo';
import { IoMdLogOut } from 'react-icons/io';
import { account } from '../lib/appwrite';

const Sidebar = () => {
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const html = document.querySelector('html');
  const toggleTheme = () => {
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(html.dataset.theme);
    localStorage.setItem('theme', html.dataset.theme);
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      html.dataset.theme = theme;
      setTheme(theme);
    }
  }, []);

  const logout = async () => {
    await account.deleteSession('current');
    localStorage.removeItem('blockAuth');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userImage');
    localStorage.removeItem('verifiedEmail');
    window.location.href = '/login';
  }

  return (
    <>
      <div className="sidebar bg-base-200 min-h-screen hidden sm:block flex flex-col">
        <div className="forLogo flex justify-center items-center px-5 pt-4">
          <Logo width={'100%'} height={'auto'} stroke="#0000FF" fill="var(--logoColor)" />
        </div>
        <ul className="menu p-4 text-base-content">
          <li className={window.location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard" className="flex items-center gap-4">
              <span className='icon'><MdChecklist /></span>
              <span className='text'>Dashboard</span>
            </Link>
          </li>
          <li className={window.location.pathname === '/statistics' ? 'active' : ''}>
            <Link to="/statistics" className="flex items-center gap-4">
              <span className='icon'><MdOutlineStackedLineChart /></span>
              <span className='text'>Statistics</span>
            </Link>
          </li>
          <li className={window.location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings" className="flex items-center gap-4">
              <span className='icon'><MdSettings /></span>
              <span className='text'>Settings</span>
            </Link>
          </li>
          <li className='border-t border-base-300 mt-3 pt-2'>
            <button className='flex items-center gap-4' onClick={logout}>
              <span className='icon'><IoMdLogOut /></span>
              <span className='text'>Logout</span>
            </button>
          </li>
        </ul>

        <div className="acoount-info border-t border-base-300">
          <div className="p-4 flex items-center gap-4">
            <div className="flex items-center flex-1">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  {localStorage.getItem('userImage') !== null ? (
                    <img src={localStorage.getItem('userImage')} alt="Profile" className='border-2 border-primary rounded-full' />
                  ) : (
                    <div className="avatar placeholder w-full">
                        <div className="bg-neutral text-neutral-content w-full rounded-full">
                            <span className="text-xl">{localStorage.getItem('userName')?.charAt(0)}</span>
                        </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{localStorage.getItem('userName')}</p>
                <p className="text-xs text-base-content/70">{localStorage.getItem('userEmail')}</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === 'light' ? <BsSun className="swap-on h-5 w-5" /> : <BsMoon className="swap-off h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="btm-nav shadow sm:hidden">
        <button className={window.location.pathname === '/dashboard' ? 'active' : ''} onClick={()=>navigate('/dashboard')}>
            <span className='icon'><MdChecklist /></span>
        </button>
        <button className={window.location.pathname === '/statistics' ? 'active' : ''} onClick={()=>navigate('/statistics')}>
            <span className='icon'><MdOutlineStackedLineChart /></span>
        </button>
        <button className={window.location.pathname === '/settings' ? 'active' : ''} onClick={()=>navigate('/settings')}>
            <span className='icon'><MdSettings /></span>
        </button>
      </div>

      <div className="headerNav navbar bg-base-100 sm:hidden shadow-sm">
            <div className="flex-1">
                <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                {theme === 'light' ? <BsSun className="swap-on h-5 w-5" /> : <BsMoon className="swap-off h-5 w-5" />}
                </button>
            </div>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      {localStorage.getItem('userImage') !== null ? (
                        <img src={localStorage.getItem('userImage')} alt="Profile" className='border-2 border-primary rounded-full' />
                      ) : (
                        <div className="avatar placeholder w-full">
                            <div className="bg-neutral text-neutral-content w-full rounded-full">
                                <span className="text-xl">{localStorage.getItem('userName')?.charAt(0)}</span>
                            </div>
                        </div>
                      )}
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    {/* <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li>
                    <li><a>Settings</a></li> */}
                    <li className='py-3'>
                      <button className='flex items-center gap-4' onClick={logout}>
                        <span className='icon'><IoMdLogOut /></span>
                        <span className='text'>Logout</span>
                      </button>
                    </li>
                </ul>
                </div>
            </div>
      </div>

    </> 
  )
}

export default Sidebar