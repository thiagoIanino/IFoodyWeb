import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import HeaderHome from '../../components/HeaderHome'
import { useParams, useLocation } from 'react-router-dom';
import './styles.scss'
import StarIcon from '@mui/icons-material/Star';
import StarsIcon from '@mui/icons-material/Stars';
import PratoModal from '../../components/Modal'
import { DrawerContext } from '../../providers/DrawerProvider';
import { useQuery } from 'react-query';
import { ClassificacaoT, IRestaurante } from '../Home';
import { Guid } from 'guid-typescript';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import HeaderRestaurante from '../../components/HeaderRestaurante';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Box, Button, LinearProgress, LinearProgressProps } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { EnderecoProps, PedidoAtivoI, Status } from '../../components/Drawer';
import { ConversorStatusParaProgresso, FormatarData, FormatarDataPorDia, PedidoGeral } from '../../components/DrawerPedido';
import { RestauranteCompletoI } from '../Restaurante';
import { toast } from 'react-toastify';
import { api } from '../Login';

export interface Pedido {
    IdPedido: Guid,
    IdCliente: Guid,
    Itens: PedidoAtivoI
}


export type PratoItemI = {
    id: Guid;
    nome: string
    idRestaurante: Guid
    quantidade: number
}

export type PedidoRestauranteI = {
    idPedido: Guid;
    valorTotal: number
    idRestaurante: Guid
    idCliente: Guid
    itens: PratoItemI[]
    enderecoCliente: EnderecoProps
    tempoPrevistoEntrega: Date
    status: Status
}

export interface AtualizacaoPedidoI {
    IdRestaurante: Guid
    IdPedido: Guid
    IdCliente: Guid
    StatusNovo: Status
}

export interface RoutePropsI {
    id: string
}

const PedidosRestaurante = () => {

    const location = useLocation()
    let { id } = useParams<RoutePropsI>()
    const { openModal, setOpenModal, setQuantidadePrato, PratoModalProps, setPratoModalProps, pratosSelecionados } = useContext(DrawerContext)
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [pedidosRestaurante, setPedidosRestaurante] = useState< PedidoRestauranteI[]>([] as PedidoRestauranteI[]);

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
                    connection.on("ReceiveMessage", (message: PedidoRestauranteI[]) => {

                        if (message?.length > 0) {
                            setPedidosRestaurante(message)
                        }
                    });

                    connection.invoke("JoinRestauranteRoom", idUsuario);

                })
                .catch((error) => console.log(error));
        }
    }, [connection]);



    const { data, isFetching } = useQuery<RestauranteCompletoI>(id, async () => {
        const response = await axios.get(`http://localhost:26373/api/restaurantes/${id}`)
        return response.data
    }
    )


    const AdequarClassificacacaoRestaurante = (classificacaoRestaurante: ClassificacaoT | undefined) => {
        switch (classificacaoRestaurante?.status) {
            case 0:
                return "Novo!"
            case 1:
                return classificacaoRestaurante?.nota

        }
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

    const ConversorStatusParaTextoRestaurante = (status: Status) => {
        if (status == Status.Aberto)
            return "Agurdando confirmação"
        else if (status == Status.Confirmado)
            return "Preparando o pedido"
        else if (status == Status.SaiuParaEntrega)
            return "O pedido saiu para entrega"
        else if (status == Status.Finalizado)
            return "Pedido entregue"
        else if (status == Status.NaoAprovado)
            return "Pedido não aprovado "
    }

    const ConversorStatusParaBtnRestaurante = (status: Status) => {
        if (status == Status.Aberto)
            return "Confirmar Pedido"
        else if (status == Status.Confirmado)
            return "Enviar para entrega"
        else if (status == Status.SaiuParaEntrega)
            return "Confirmar entrega"
        else if (status == Status.Finalizado)
            return ""
        else if (status == Status.NaoAprovado)
            return ""
    }

    const FormatarGuidPedido = (guid: Guid) => {

        let idPedido = guid.toString().slice(0, 4);
        return idPedido
    }

    const HandleAlterarStatusPedido = (pedido: PedidoRestauranteI) => {

        console.log("passou1")
        let novoStatus = pedido.status + 1
        let pedidoOutput: AtualizacaoPedidoI = {
            IdCliente: pedido.idCliente,
            IdPedido: pedido.idPedido,
            IdRestaurante: pedido.idRestaurante,
            StatusNovo: novoStatus
        }

        const token = localStorage.getItem("token")
        console.log("passou2")
         toast.promise(
            api.patch(`pedidos`, pedidoOutput, { headers: { 'Authorization': `Bearer ${token}` } }).then(x => {
                console.log("foi")
            }),
            {
                pending: 'Processando',
                error: {
                    render: ({ data }) => {
                        return `${data}`
                    }
                }
            })
            console.log("passou3")
    }

    return (
        <>
            <HeaderRestaurante />
            <div className="RestauranteContainer">

                <div className="RestauranteTopContainer">
                    <div className="LeftSideRestauranteContainer">
                        <img src={data?.restaurante?.urlLogo} alt="" />
                        <h2>Pedidos {data?.restaurante?.nomeRestaurante}</h2>
                        <StarsIcon />
                    </div>
                    <div className="ClassificacaoRestaurante">
                        <p>{AdequarClassificacacaoRestaurante(data?.restaurante?.classificacao)}</p>
                        <StarIcon id={data?.restaurante?.classificacao?.status == 0 ? "displayNone" : ""} />
                    </div>

                </div>
                <PratoModal />


                <div className="CategoriaContainer">
                    <CircularProgress color="error" id={isFetching ? "circularProgress" : "displayNone"} />

                    <h3 id={pedidosRestaurante == null || pedidosRestaurante?.length == 0 ? "NenhumPedidoPorAqui" : "displayNone"}>Nenhum pedido por aqui...</h3>
                    <div className="ItemPedidoContainer">
                        {pedidosRestaurante?.map(x =>
                            <div className='ItemPedido' key={x.idPedido.toString()} id={x.status == Status.Finalizado ? 'pedidoFinalizado' : ''}>
                                <div className="TopItemPedido">
                                    <h3>Pedido #{FormatarGuidPedido(x.idPedido)}</h3>
                                    <span>{ConversorStatusParaTextoRestaurante(x.status)}</span>
                                </div>
                                <LinearProgressWithLabel id={x.status != Status.Finalizado ? "progressBarPedido" : "displayNone"} color="success" className="BarraDeProgresso" value={ConversorStatusParaProgresso(x.status)} />
                                <div className='ListPedido'>
                                    {x.itens?.map(y => <p key={y.id.toString()}>- {y.quantidade + "X " + y.nome}</p>)}
                                </div>
                                <p id={x.status != Status.Finalizado ? "EnderecoItemPedido" : "displayNone"}>Endereço: {x.enderecoCliente.primeiraLinhaEnd}</p>
                                <p id={x.status != Status.Finalizado ? "EnderecoItemPedido" : "displayNone"}>Entrega para <span id='HorarioPedido'> {FormatarData(x.tempoPrevistoEntrega)}h</span></p>
                                <p id={x.status == Status.Finalizado ? "EnderecoItemPedido" : "displayNone"}>Pedido entregue as <span id='HorarioPedido'> {FormatarData(x.tempoPrevistoEntrega)}</span> do dia {FormatarDataPorDia(x.tempoPrevistoEntrega)}</p>
                                <div id={x.status != Status.Finalizado ? "" : "displayNone"} className="BottomItemPedido">
                                    <Button variant="outlined" color='error' className='ButtonCancelar' ><ClearIcon /></Button>
                                    <Button variant="contained" color='error' className='ButtonStatus' onClick={() => HandleAlterarStatusPedido(x)} >{ConversorStatusParaBtnRestaurante(x.status)}</Button>
                                </div>
                            </div>)}

                    </div>


                </div>


            </div>
        </>
    )
}

export default PedidosRestaurante

