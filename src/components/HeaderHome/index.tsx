import { Component, useContext, useEffect, useState } from 'react';
import logo from '../../assets/logoVermelha.png'
import { Link } from 'react-router-dom'
import './styles.scss'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { DrawerContext } from '../../providers/DrawerProvider';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export interface HeaderI {
    isLogged: boolean
    HandleOpenDrawer: () => void
}
const HeaderHome = () => {
    const { setOpenDrawer,setIsLogged, isLogged, openDrawer, setOpenPedidoDrawer, openPedidoDrawer } = useContext(DrawerContext)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        localStorage.setItem("token","")
        setIsLogged(false)
        setAnchorEl(null);
    };

    return (
        <div className='HeaderHome'>
            <Link to={"/"}>
                <img src={logo} className="Logo" alt="Logo" />
            </Link>
            <div className="LeftSideHomeHeader">
                <div onClick={() => setOpenPedidoDrawer(!openPedidoDrawer)}>
                    <ArticleIcon />
                </div>
                <div onClick={() => setOpenDrawer(!openDrawer)}>
                    <ShoppingBasketIcon />
                </div>
                <button id='discretButton' onClick={handleClick}>
                <PersonIcon id="userIcon"/>
                </button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <Link to={"/login"}>
                        <MenuItem onClick={handleClose}>{isLogged?'Sair':'Login'}</MenuItem>
                    </Link>
                </Menu>

            </div>
        </div>
    )
}

export default HeaderHome