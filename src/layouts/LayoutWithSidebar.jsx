import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Layout Components
const LayoutWithSidebar = ({ children }) => {
    return (
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    )
  }

export default LayoutWithSidebar;