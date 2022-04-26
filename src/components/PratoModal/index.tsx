import { Button, MenuItem, Modal, Stack, TextField } from '@mui/material'
import React, { useContext, useState, useEffect } from 'react'
import { DrawerContext } from '../../providers/DrawerProvider'
import InputMask from 'react-input-mask';
import DrawerComponent from '../Drawer'
import './styles.scss'
import { toast } from 'react-toastify';
import axios from 'axios';
import { ICartao } from '../../pages/Login';
import { OpcoesBandeiraCartao } from '../../Utils/BandeiraCartao';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
import { Day } from 'date-fns'
import { ClassificacaoPratoE } from '../../pages/Restaurante';
import { Guid } from 'guid-typescript';

interface PratoOutputI {
    IdRestaurante: Guid
    NomePrato: string
    Descricao: string
    UrlImagem: string
    Valor: number
    Classificacao: ClassificacaoPratoE
}

const PratoModal = () => {

    const { openPratoModal, setOpenPratoModal, Cartoes, setCartoes } = useContext(DrawerContext)

    const [NomePrato, setNomePrato] = useState("")
    const [Descricao, setDescricao] = useState("")
    const [NomeTitular, setNomeTitular] = useState("")
    const [ValorPrato, setValorPrato] = useState(0)
    const [Url, setUrl] = useState("")
    const [Classificacao, setClassificacao] = useState(ClassificacaoPratoE.Classicos)


    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
    })

    const HandleCadastrarPrato = async () => {

        let id = localStorage.getItem("idUsuario")
        let IdRestaurante: Guid = Guid.create()
        if (id != null)
            IdRestaurante = Guid.parse(id)

        let prato: PratoOutputI = {
            IdRestaurante,
            Classificacao,
            Descricao,
            NomePrato,
            UrlImagem: Url,
            Valor: ValorPrato
        }

        console.log(prato)

        const token = localStorage.getItem("token")

        await toast.promise(
            api.post(`pratos`, prato, { headers: { 'Authorization': `Bearer ${token}` } }).then(x => {
                setOpenPratoModal(!openPratoModal)
                toast.success(`Prato cadastrado com sucesso`);
            }),
            {
                pending: 'Processando',
                error: {
                    render: ({ data }) => {
                        return `${data}`
                    }
                }
            })

    }

    const LimparInputsPrato = () => {
        setNomePrato("")
        setDescricao("")
        setNomeTitular("")
        setValorPrato(0)
        setUrl("")
    }
    const [value, setValue] = React.useState<Date | null>(new Date());

    return (
        <Modal
            open={openPratoModal}
            onClose={() => setOpenPratoModal(!openPratoModal)}
        >
            <div className="ModalCartaoEndereco">
                <h3>Cadastro prato</h3>
                <div className="CadastroCartaoContainer">

                    <TextField label="Nome prato" value={NomePrato} onChange={(event) => setNomePrato(event.target.value)} />
                    <TextField label="Descricao" value={Descricao} onChange={(event) => setDescricao(event.target.value)} />
                    <TextField label="Url imagem" type="text" value={Url} onChange={(event) => setUrl(event.target.value)} />


                    <div className="CadastroCartaoContent">
                        <TextField label="Valor" type="number" value={ValorPrato} onChange={(event) => setValorPrato(Number(event.target.value))} />
                        <TextField id="selectBandeira" select label="Bandeira" value={Classificacao} onChange={(event) => setClassificacao(Number(event.target.value))}>

                            <MenuItem value={0}>
                                Destaques
                            </MenuItem>)
                            <MenuItem value={1}>
                                Classicos
                            </MenuItem>)
                            <MenuItem value={2}>
                                Bebidas
                            </MenuItem>)
                        </TextField>

                    </div>
                </div>
                <Button onClick={HandleCadastrarPrato} color="error" variant="contained">Adicionar</Button>

            </div>
        </Modal>
    )
}


export default PratoModal