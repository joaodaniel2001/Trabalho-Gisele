import React from 'react'
import './Leftbar'
import { Link } from 'react-router-dom'

/* Ícones */
import { IoHomeSharp } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { GrTask } from "react-icons/gr";

const Leftbar = ({ menu, setMenu }) => {

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
                    <li
                        key={i}
                        onClick={() => }
                    ></li>
                ))}
            </ul>
        </div>
    )
}

export default Leftbar