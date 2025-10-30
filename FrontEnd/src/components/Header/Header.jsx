import React from 'react'
import './Header.css'

const Header = ({ menu }) => {
    return (
        <div className='header'>
            <h1>{menu}</h1>
        </div>
    )
}

export default Header
