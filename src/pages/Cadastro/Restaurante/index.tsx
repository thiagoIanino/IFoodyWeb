import { Component, useEffect, useState, ChangeEvent } from 'react';
import './styles.scss'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Header from '../../../components/Header/index'
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom'
import PerfilRestaurante from '../../../assets/perfilRestaurante.jpg'
import axios from 'axios';
import { type } from 'os';
import { toast } from 'react-toastify';

export interface ICadastroRestauranteInput {
    NomeDonoRestaurante: string,
    NomeRestaurante: string,
    Tipo: string,
    CNPJ: string,
    Email: string,
    Senha: string,
    TempoMedioEntrega: number | string | null,
    SubDescricao: string,
    UrlLogo: string
}

const CadastroRestaurante = () => {

    const [UrlImagem, setUrlImagem] = useState<string>(PerfilRestaurante)
    const [ErroInputUrl, setErroInputUrl] = useState<boolean>(false)
    const [ErroInputTempoEntrega, setErroInputTempoEntrega] = useState<boolean>(false)
    const [ErroTestHelperInputUrl, setErroTestHelperInputUrl] = useState<string>("")

    const [NomeResponsavelRestaurante, setNomeResponsavelRestaurante] = useState<string>("")
    const [NomeRestaurante, setNomeRestaurante] = useState<string>("")
    const [TipoRestaurante, setTipoRestaurante] = useState<string>("")
    const [CNPJRestaurante, setCNPJRestaurante] = useState<string>("")
    const [EmailRestaurante, setEmailRestaurante] = useState<string>("")
    const [SenhaRestaurante, setSenhaRestaurante] = useState<string>("")
    const [SubDescricaoRestaurante, setSubDescricaoRestaurante] = useState<string>("")
    const [TempoMedioEntregaRestaurante, SetTempoMedioEntregaRestaurante] = useState<number | string | null>(null)
    const history = useHistory();


    useEffect(() => { console.log(TempoMedioEntregaRestaurante) }, [TempoMedioEntregaRestaurante])
    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
    })

    const HandleCadastrarRestaurante = async() => {
        const restaurante: ICadastroRestauranteInput = {
            NomeDonoRestaurante: NomeResponsavelRestaurante,
            NomeRestaurante: NomeRestaurante,
            CNPJ: CNPJRestaurante,
            Email: EmailRestaurante,
            Senha: SenhaRestaurante,
            Tipo: TipoRestaurante,
            UrlLogo: UrlImagem,
            SubDescricao: SubDescricaoRestaurante,
            TempoMedioEntrega: TempoMedioEntregaRestaurante
        }


        const response = await toast.promise(
            api.post("restaurantes", restaurante).then(x => {

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

    const SetarValorTempoEstimado = (value: string) => {

        let valorConvertido: string | number = Number(value)
        if (isNaN(valorConvertido)) {
            setErroInputTempoEntrega(true)
        } else {

            SetTempoMedioEntregaRestaurante(valorConvertido)
            setErroInputTempoEntrega(false)
        }

    }

    const alterarUrlImagem = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        const terminacaoUrl = value.slice(value.length - 3);

        if (!terminacaoUrlValida(terminacaoUrl)) {
            value = PerfilRestaurante
            setErroInputUrl(true)
            setErroTestHelperInputUrl("Só é aceito URLs com terminação .jpg,.png e .svg")
        } else {
            setErroTestHelperInputUrl("")
            setErroInputUrl(false)
        }

        setUrlImagem(value);
    }

    const terminacaoUrlValida = (terminacaoUrl: string) => {
        if (terminacaoUrl != "png" && terminacaoUrl != "jpg" && terminacaoUrl != "svg") {
            return false
        }
        return true
    }

    const handleRegisterRestaurant = () => {
        history.push("/login")
    }

    return (
        <>
            <Header isLogin={false} isLogged={false} />
            <div className="LogoRestauranteContainer">
                <img className='LogoRestaurante' src={UrlImagem} alt="Imagem não encontrada" />
            </div>
            <div className='CadastroRestauranteFormContainer'>
                <h3>Cadastro de parceiros</h3>
                <div className="CadastroRestauranteFormContent">
                    <div className='CadastroRestauranteForm' >

                        <TextField label="Nome" value={NomeResponsavelRestaurante} onChange={(event) => setNomeResponsavelRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" label="Nome Restaurante" variant="outlined" value={NomeRestaurante} onChange={(event) => setNomeRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" label="Tipo" variant="outlined" value={TipoRestaurante} onChange={(event) => setTipoRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" label="CNPJ" variant="outlined" value={CNPJRestaurante} onChange={(event) => setCNPJRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" label="Sub descrição(max. 30 carctéres)" variant="outlined" value={SubDescricaoRestaurante} onChange={(event) => setSubDescricaoRestaurante(event.target.value)} />

                    </div>

                    <div className='CadastroRestauranteForm' id='rightFormContainer'>
                        <TextField onChange={alterarUrlImagem} id="component-error" error={ErroInputUrl} helperText={ErroTestHelperInputUrl} label="Url logo" variant="outlined" />
                        <TextField id="outlined-basic" label="E-mail" variant="outlined" value={EmailRestaurante} onChange={(event) => setEmailRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" label="Senha" variant="outlined" value={SenhaRestaurante} onChange={(event) => setSenhaRestaurante(event.target.value)} />
                        <TextField id="outlined-basic" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Tempo estimado entrega(em minutos)" error={ErroInputTempoEntrega} variant="outlined" value={TempoMedioEntregaRestaurante} onChange={(event) => SetarValorTempoEstimado(event.target.value)} />
                        <Button variant="contained" onClick={HandleCadastrarRestaurante}>Cadastrar</Button>
                    </div>

                </div>

            </div>

        </>
    )

}


export default CadastroRestaurante