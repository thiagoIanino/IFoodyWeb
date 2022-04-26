import { Component, useEffect, useState } from 'react';
import './styles.scss'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Header from '../../../components/Header/index'
import * as React from 'react';
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { useFetch } from '../../../hooks/useFetch';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ICadastroInput {
  Nome: string,
  Email: string,
  Senha: string
}

const CadastroCliente = () => {

  const [NomeCliente, setNomeCliente] = useState<string>("")
  const [EmailCliente, setEmailCliente] = useState<string>("")
  const [SenhaCliente, setSenhaCliente] = useState<string>("")
  const api = axios.create({
    baseURL: "http://localhost:26373/api/"
  })


  const HandleCadastrarCliente = async () => {


    const usuario: ICadastroInput = {
      Email: EmailCliente,
      Nome: NomeCliente,
      Senha: SenhaCliente
    }

    const response = await toast.promise(

    api.post("clientes", usuario)
    .then(x => {
      
     
    }),
    {
      pending: 'Processando',
      success:'Cadastrado com sucesso',
      error: {render:({data})=>{
        return `${data}`
      }}
    }
    )
  }

  //const handleClick = () => toast.success('Mensagem de sucesso')
  return (
    <>
      <Header isLogin={false} isLogged={false} />
      <div className='CadastroFormContainer'>
        <div className="CadastroFormContent">
          <h3>Cadastro</h3>
          <TextField label="Nome" value={NomeCliente} onChange={(event) => setNomeCliente(event.target.value)} />
          <TextField id="outlined-basic" label="E-mail" variant="outlined" value={EmailCliente} onChange={(event) => setEmailCliente(event.target.value)} />
          <TextField id="outlined-basic" label="Senha" variant="outlined" value={SenhaCliente} onChange={(event) => setSenhaCliente(event.target.value)} />
          <Button variant="contained" onClick={HandleCadastrarCliente}>Cadastrar</Button>
          <hr />
          <Link to='/cadastro/restaurante'>
            <p>Quero cadastrar meu restaurante</p>
          </Link>

        </div>
      </div>
    </>
  )

}

export default CadastroCliente