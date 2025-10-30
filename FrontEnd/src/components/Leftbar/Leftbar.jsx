import React from 'react'
import './Leftbar.css'
import { Link } from 'react-router-dom'

/* Ícones */
import { IoHomeSharp } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { GrTask } from "react-icons/gr";

const Leftbar = ({ menu, setMenu }) => {

    const getColor = (menuName) => {
        return menu === menuName ? '#fff' : '#8B8B8BFF'
    }

    const menuItems = [
        { label: 'Home', icon: <IoHomeSharp />, to: '/' },
        { label: 'Dashboard', icon: <RiDashboardFill />, to: '/dashboard' },
        { label: 'Questionario', icon: <GrTask />, to: '/questionario' }
    ]

    return (
        <div className='leftbar'>
            {/* Menu */}
            <ul className="leftbar-menu">
                {menuItems.map((item, i) => (
                    <Link
                        key={i}
                        to={item.to}
                        onClick={() => setMenu(item.label)}
                        className={`leftbar-icon-text ${menu === item.label ? 'active' : ''}`}
                    >
                        <span style={{ color: getColor(item.label) }}>
                            {item.icon}
                        </span>
                        <span style={{ color: getColor(item.label) }} className='leftbar-label'>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default Leftbar