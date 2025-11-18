import React from 'react'
import './Header.css'

/* Ícones */
import { IoHomeSharp } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { GrTask } from "react-icons/gr";
import { LuFileSpreadsheet } from "react-icons/lu";

const Header = ({ menu }) => {

    const headerIcons = [
        { label: 'Home', icon: <IoHomeSharp /> },
        { label: 'Dashboard', icon: <RiDashboardFill /> },
        { label: 'Planilha', icon: <LuFileSpreadsheet /> },
        { label: 'Questionario', icon: <GrTask /> }
    ]

    const currentItem = headerIcons.find((item) => item.label === menu);

    return (
        <div className='header'>
            <h1>
                {currentItem && currentItem.icon}
                <span>{menu}</span>
            </h1>
        </div>
    )
}

export default Header