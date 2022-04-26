import { Component, useEffect, useState,useContext } from 'react';
import './styles.scss'
import logo from '../../assets/logoBranca.png'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Link, useHistory } from 'react-router-dom'
import Header from '../../components/Header/index'
import axios from 'axios';
import { DrawerContext } from '../../providers/DrawerProvider';
import { toast } from 'react-toastify';
import { Guid } from 'guid-typescript';


export interface ILoginUsuario {
  Email: string,
  Senha: string
}

export interface ILoginResponse {
  token: string,
  id:Guid,
  nome:string,
  cartoes: ICartao[]
}
export interface ICartao {
  idCartao:Guid,
  idCliente:Guid,
  numeroMascarado:string,
  bandeira:string
}

const Login = () => {
  const [EmailUsuario, setEmailUsuario] = useState<string>("")
  const [SenhaUsuario, setSenhaUsuario] = useState<string>("")
  const [TipoUsuario, setTipoUsuario] = useState<string>("Sou Cliente")

  const { setTokenAutenticacao ,setIsLogged,RedirectTo,setRedirectTo,setCartoes} = useContext(DrawerContext)
  const history = useHistory();

  const handleLogin = async () => {

    const endpointTipo = TipoUsuario == "Sou Cliente" ? "clientes" : "restaurantes"

    const usuario: ILoginUsuario = {
      Email: EmailUsuario,
      Senha: SenhaUsuario
    }
   

    const response = await toast.promise(
    api.post<ILoginResponse>(`${endpointTipo}/login`, usuario).then(x => {

      setTokenAutenticacao(x.data.token)
      toast.success(`Bem-vindo ${x.data.nome}`);
      localStorage.setItem("token", x.data.token)
      localStorage.setItem("idUsuario", x.data.id.toString())
      setIsLogged(true)

      if(endpointTipo == "clientes"){
      history.push(RedirectTo)
      setRedirectTo("/")
      setCartoes(x.data.cartoes)
      }else{
        history.push(`/restaurantesGerencia/${x.data.id}`);
      }
    }),
    {
      pending: 'Processando',
      error: {render:({data})=>{
        return `${data}`
      }}
    })

  }

  return (
    <>
      <Header isLogin={true} isLogged={false} />
      <div className='LoginFormContainer'>
        <div className="LoginFormContent">
          <h3>Login</h3>
          <TextField label="E-mail" value={EmailUsuario} onChange={(event) => setEmailUsuario(event.target.value)} />
          <TextField id="outlined-basic" type="password" label="Senha" variant="outlined" value={SenhaUsuario} onChange={(event) => setSenhaUsuario(event.target.value)} />

          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(event) => setTipoUsuario(event.target.value)}
          >
            <FormControlLabel value="Sou Cliente" control={<Radio />} label="Sou Cliente" />
            <FormControlLabel value="Parceiro" control={<Radio />} label="Parceiro" />
          </RadioGroup>
          <Button onClick={handleLogin} variant="contained">Logar</Button>
        </div>
      </div>
    </>
  )

}

export const api = axios.create({
  baseURL: "http://localhost:26373/api/"
})

export default Login