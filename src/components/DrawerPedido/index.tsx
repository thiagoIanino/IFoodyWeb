import { useContext, useEffect, useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import { DrawerContext } from '../../providers/DrawerProvider'

import './styles.scss'
import { Guid } from 'guid-typescript';
import { PratoPedidoI } from '../../pages/Restaurante';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import EnderecoModal from '../EnderecoModal';
import { ExibirBandeiraCartao, GuidDefault } from '../../Utils/BandeiraCartao';
import { toast } from 'react-toastify';
import CartaoModal from '../CartaoModal';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
export enum Status {
    EmProcessamento = 1,
    Aberto = 2,
    Confirmado = 3,
    SaiuParaEntrega = 4,
    Finalizado = 5,
    NaoAprovado = 6

}
export interface PedidoAtivoI {
    idPedido: Guid;
    idRestaurante: Guid;
    nomeRestaurante: string;
    urlImagemRestaurante: string;
    tempoPrevistoEntrega: Date;
    idCliente: Guid;
    status: Status
}
export interface Avaliacao {
    idRestaurante: Guid;
    idCliente: Guid;
    nota:number;
    nomeRestaurante:string
}
export interface PedidoGeral {
    pedidos: PedidoAtivoI[];
    avaliacoesPendentes: Avaliacao[];
}

export interface EnderecoProps {
    id: Guid;
    idCliente: Guid;
    enderecoLinha1: string;
    enderecoLinha2: string;
}

interface PratosOutput {
    Id: Guid,
    Quantidade: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <>
            {value === index && (
                <>{children}</>
            )}
        </>
    );
}

function LinearIndeterminate(props: LinearProgressProps) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress {...props} />
        </Box>
    );
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
        </Box>
    );
}

const DrawerPedido = () => {
    const { setOpenPedidoDrawer, valuePanelPedido, setValuePanelPedido, openPedidoDrawer, setOpenAvaliacaoModal, openAvaliacaoModal, avaliacoesPendentes, setAvaliacoesPendentes } = useContext(DrawerContext)


    const [value, setValue] = useState(0);
    const [valorBarraDeProgresso, setValorBarraDeProgresso] = useState(25);
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [pedidosAtivos, setPedidosAtivos] = useState<null | PedidoAtivoI[]>(null);


    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("http://localhost:26373/webhook")
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {

            let idUsuario = localStorage.getItem("idUsuario")

            connection
                .start()
                .then(() => {
                    connection.on("ReceiveMessage", (message: PedidoGeral) => {
                        console.log(message)
                        if (message?.pedidos?.length > 0) {
                            setPedidosAtivos(message.pedidos)
                        }

                        if(message?.avaliacoesPendentes?.length > 0){
                            let idRestaurante = message.avaliacoesPendentes[0].idRestaurante
                            let nomeRestaurante = message.pedidos.find(x => x.idRestaurante == idRestaurante)?.nomeRestaurante ?? ""
                            message.avaliacoesPendentes[0].nomeRestaurante = nomeRestaurante
                            setAvaliacoesPendentes(message.avaliacoesPendentes)
                            setOpenAvaliacaoModal(!openAvaliacaoModal)
                        }
                    });

                    connection.invoke("JoinClienteRoom", idUsuario);

                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    useEffect(() => {
        console.log(pedidosAtivos)
        if (PedidoIsValid()) {
            setValuePanelPedido(0)
        }
    }, [pedidosAtivos])


    const PedidoIsValid = () => {

        if (pedidosAtivos != null && pedidosAtivos != undefined && pedidosAtivos.length > 0) {
            return true
        }
        return false
    }

    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
    })

    const ConversorStatusParaTexto = (status: Status) => {
        if (status == Status.Aberto)
            return "O restaurante está confirmando o pedido"
        else if (status == Status.Confirmado)
            return "O restaurante está preparando o pedido"
        else if (status == Status.SaiuParaEntrega)
            return "O pedido saiu para entrega"
        else if (status == Status.Finalizado)
            return "Pedido entregue"
        else if (status == Status.NaoAprovado)
            return "Pedido não aprovado "
    }



    return (
        <>
            <React.Fragment >
                <Drawer
                    anchor={'right'}
                    open={openPedidoDrawer}
                    onClose={() => {
                        setOpenPedidoDrawer(!openPedidoDrawer)
                    }}
                >
                    <Box className='Box'
                        sx={{ width: 500 }}
                        role="presentation"
                        onKeyDown={() => {
                            setOpenPedidoDrawer(openPedidoDrawer)
                        }}
                    >
                        <div className="TopPanel">
                            <h3 className="TituloPassoPedido">{"Seus pedidos"}</h3>
                            <LinearIndeterminate id={valuePanelPedido == 1 ? "" : "displayNone"} color="error" className="BarraDeProgresso" />
                            <hr id={valuePanelPedido != 1 ? "HrPedido" : "displayNone"} />
                            <TabPanel value={valuePanelPedido} index={0}>
                                <div className={PedidoIsValid() ? "displayNone" : "EnderecoNaoCadastrado"}>
                                    <h4>Nenhum pedido por aqui</h4>
                                </div>
                                {pedidosAtivos?.map(x =>

                                    <div className='BlockPedidosAtivos' key={x.idPedido.toString()}>
                                        <p id={x.status == Status.Finalizado?'displayNone':'' }>Previsão de entrega</p>
                                        <span id={x.status == Status.Finalizado?'displayNone':'TempoEntrega'}>{FormatarData(x.tempoPrevistoEntrega)}</span>
                                        <LinearProgressWithLabel id={value >= 4 || x.status == Status.Finalizado ? "displayNone" : "progressBarPedido"} color="success" className="BarraDeProgresso" value={ConversorStatusParaProgresso(x.status)} />
                                        <span id='StatusPedido'>{ConversorStatusParaTexto(x.status)} {x.status == Status.Finalizado?` as ${FormatarData(x.tempoPrevistoEntrega)}  do dia ${FormatarDataPorDia(x.tempoPrevistoEntrega)} `:''}</span>
                                        <div className='BottomSituacaoPedido'>
                                            <img id='miniLogo' src={x.urlImagemRestaurante} alt="logo" />
                                            <h3>{x.nomeRestaurante}</h3>
                                        </div>
                                    </div>)}
                            </TabPanel>
                            <TabPanel value={valuePanelPedido} index={1}>
                                <h2 className='PagamentoSendoProcessado'>Pagamento sendo processado <div className='Pointanimation'>.</div> <div className='Pointanimation'>.</div><div className='Pointanimation'>.</div></h2>
                            </TabPanel>
                        </div>

                    </Box>

                </Drawer>
                <EnderecoModal />
                <CartaoModal />
            </React.Fragment>

        </>)

}

export const ConversorStatusParaProgresso = (status: Status) => {
    if (status == Status.Aberto)
        return 20
    else if (status == Status.Confirmado)
        return 50
    else if (status == Status.SaiuParaEntrega)
        return 80
    else if (status == Status.Finalizado)
        return 100
    else if (status == Status.NaoAprovado)
        return 0

    return 20
}

export const FormatarDataPorDia = (date: Date) => {

    let dateFromat = new Date(date)

    let options: Intl.DateTimeFormatOptions = { day:"2-digit", month: "2-digit", year: "2-digit"};
    return new Intl.DateTimeFormat('pt-BR', options).format(dateFromat);
}

export const FormatarData = (date: Date) => {

    let dateFromat = new Date(date)

    let options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", dayPeriod: "short" };
    return new Intl.DateTimeFormat('pt-BR', options).format(dateFromat);
}
export default DrawerPedido