import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from './logo.svg';
import './styles/global.scss';
import Routes from './routes';
import {DrawerContextProvider}  from './providers/DrawerProvider'
import DrawerComponent from './components/Drawer'
import { ToastContainer } from 'react-toastify';
import DrawerPedido from './components/DrawerPedido';
import ModalAvaliacao from './components/ModalAvaliacao';
import PratoModal from './components/PratoModal';

const App = () =>{
  return (
  <>
  <ToastContainer className='toastifyClass' position='top-left'/>
   <DrawerContextProvider>
   <Router>
    <Routes/>
    <DrawerComponent/>
    <ModalAvaliacao/>
    <PratoModal/>
    <DrawerPedido/>
   </Router>
   </DrawerContextProvider>
   </>
    
  );
}

export default App;
