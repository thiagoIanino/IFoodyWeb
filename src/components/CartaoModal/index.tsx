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

const CartaoModal = () => {

    const { openCartaoModal, setOpenCartaoModal, Cartoes, setCartoes } = useContext(DrawerContext)

    const [NumeroCartao, setNumeroCartao] = useState("")
    const [Validade, setValidade] = useState<Date | null>(null)
    const [NomeTitular, setNomeTitular] = useState("")
    const [Cpf, setCpf] = useState("")
    const [Cvv, setCvv] = useState("")
    const [Bandeira, setBandeira] = useState("")


    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
    })

    const HandleAdicionarCartao = async () => {
        let cartaoSemMascara = NumeroCartao.replace(/-/g, "")
        const token = localStorage.getItem("token")
        console.log(cartaoSemMascara)

        const cartao = {
            Numero: cartaoSemMascara,
            Validade,
            NomeTitular,
            Cpf,
            Bandeira
        }

        const response = await toast.promise(
            api.post<ICartao>(`clientes/cartao`, cartao, { headers: { 'Authorization': `Bearer ${token}` } }).then(x => {
                setCartoes([...Cartoes, x.data])
                setOpenCartaoModal(!openCartaoModal)
                LimparInputsCartao()
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

    const LimparInputsCartao = () => {
        setNumeroCartao("")
        setValidade(null)
        setNomeTitular("")
        setCpf("")
        setBandeira("")
    }
    const [value, setValue] = React.useState<Date | null>(new Date());

    return (
        <Modal
            open={openCartaoModal}
            onClose={() => setOpenCartaoModal(!openCartaoModal)}
        >
            <div className="ModalCartaoEndereco">
                <h3>Cartão</h3>
                <div className="CadastroCartaoContainer">

                    <InputMask
                        mask="9999-9999-9999-9999"
                        alwaysShowMask={true}
                        value={NumeroCartao}
                        disabled={false}
                        onChange={(event) => setNumeroCartao(event.target.value)}
                    >
                        {() => <TextField label="Numero Cartão" />}
                    </InputMask>

                    <TextField label="Nome Titular" value={NomeTitular} onChange={(event) => setNomeTitular(event.target.value)} />
                    <div className="CadastroCartaoContent">
                    <TextField label="Cpf" type="number" value={Cpf} onChange={(event) => setCpf(event.target.value)} />
                    <InputMask
                        mask="999"
                        alwaysShowMask={true}
                        value={Cvv}
                        disabled={false}
                        onChange={(event) => setCvv(event.target.value)}
                    >
                        {() => <TextField label="Cvv" />}
                    </InputMask>
                    </div>
                    <div className="CadastroCartaoContent">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack >
                                <DesktopDatePicker
                                    label="Validade"
                                    value={Validade}
                                    views={['year', 'month']}
                                    onChange={(newValue) => {
                                        setValidade(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{width:210}} {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <TextField id="selectBandeira" select label="Bandeira" value={Bandeira} onChange={(event) => setBandeira(event.target.value)}>
                            {OpcoesBandeiraCartao.map(x =>
                                <MenuItem key={x.nome} value={x.nome}>
                                    <img id='ImgBandeira' src={x.img} alt="" />
                                    {x.nome}
                                </MenuItem>)}
                        </TextField>

                    </div>
                </div>
                <Button onClick={HandleAdicionarCartao} color="error" variant="contained">Adicionar</Button>

            </div>
        </Modal>
    )
}


export default CartaoModal