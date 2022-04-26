import { Component, useEffect, useState } from 'react';
import logo from '../../assets/logoBranca.png'
import { Link } from 'react-router-dom'
import './styles.scss'


export interface HeaderI {
    isLogin: boolean;
    isLogged: boolean
}

const isLoginOption = (isLogin: boolean) => {
    return isLogin
}

const Header = (props: HeaderI) => {

    return (
        <div className='Header'>
            <Link to="/">
                <img src={logo} className="Logo"  alt="Logo" />
            </Link>
            <Link className={props.isLogged ? "Invisible" : ""} to={props.isLogin ? "cadastro/cliente" : "/login"}>
                <h3 className='Cadastro'>{props.isLogin ? "Cadastre-se" : "Login"}</h3>
            </Link>
        </div>
    )
}

export default Header