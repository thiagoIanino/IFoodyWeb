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
export enum Status{
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
    idCliente:Guid;
    status:Status
}

export interface EnderecoProps {
    id: Guid;
    idCliente: Guid;
    primeiraLinhaEnd: string;
    segundaLinhaEnd: string;
}

interface PratosOutput{
    Id:Guid,
    Quantidade:number
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
        <LinearProgress {...props}/>
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

const DrawerComponent = () => {
    const { setOpenDrawer,setOpenPedidoDrawer,openPedidoDrawer, setIsLogged, isLogged, openDrawer, openModal, setOpenModal, pratosSelecionados, setPratosSelecionados, setPratoModalProps,
        setQuantidadePrato, ValorTotalPedido, setRedirectTo, setOpenEnderecoModal, openEnderecoModal, EnderecoSelecionado, setEnderecoSelecionado, Cartoes,
        setCartoes, Enderecos, setEnderecos, openCartaoModal, setOpenCartaoModal, CartaoSelecionado, setCartaoSelecionado,setValuePanelPedido} = useContext(DrawerContext)


    const [value, setValue] = useState(0);
    const [teste, setTeste] = useState<Guid | null>(null);
    const [tituloPedido, setTituloPedido] = useState("Carrinho");
    const [valorBarraDeProgresso, setValorBarraDeProgresso] = useState(25);
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [pedidosAtivos, setPedidosAtivos] = useState<null | PedidoAtivoI[]>(null);

    const history = useHistory();
    const location = useLocation();



    useEffect(() => {
        if (value == 0) {
            setTituloPedido("Carrinho")
            setValorBarraDeProgresso(20)
        }
        if (value == 1) {
            setValorBarraDeProgresso(40)
            setTituloPedido("Entrega")
            if (isLogged) {
                const token = localStorage.getItem("token");
                axios.get<EnderecoProps[]>(`http://localhost:26373/api/clientes/endereco`, { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(x =>{
                        console.log(x.data)
                        setEnderecos(x.data)})
                    .catch((error: AxiosError) => {
                        if (error.response?.status == 401)
                            localStorage.setItem("token", "")
                        localStorage.setItem("carrinho", "")
                        localStorage.setItem("idUsuario", "")
                        setIsLogged(false)
                        setOpenDrawer(false)
                        setValue(0)
                        toast.warning(`Sua sessão expirou`);
                        history.push("/login")
                    })

            }
        }
        if (value == 2) {
            setValorBarraDeProgresso(60)
            setTituloPedido("Pagamento")
            if (Cartoes.length == 0) {
                const token = localStorage.getItem("token");
                axios.get(`http://localhost:26373/api/clientes/cartao`, { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(x => {
                        setCartoes(x.data)
                    })
            }
        }
        if (value == 3) {
            setValorBarraDeProgresso(80)
            setTituloPedido("Pedido")
        }
    }, [value])

    const HandleEscolherEndereco = () => {

        if (pratosSelecionados.length > 0) {
            if (isLogged == true)
                setValue(1)
            else {
                history.push("/login")
                setOpenDrawer(!openDrawer)
                setRedirectTo(location.pathname)
            }
        }
    }

    const HandleEscolherCartao = () => {

        if (EnderecoSelecionado != null) {
            setValue(2)
        }

    }
    const HandleRevisarPedidoCartao = () => {
        if (CartaoSelecionado.idCartao != GuidDefault) {
            setValue(3)
        }

    }

    const HandleRemoverItemCarrinho = (id: Guid) => {

        var pratos = pratosSelecionados
        var pratosAtualizados = pratos.filter(x => x.id !== id)
        localStorage.setItem("carrinho", JSON.stringify(pratosAtualizados))
        setPratosSelecionados(pratosAtualizados)
    }

    const HandleEditarItemCarrinho = (prato: PratoPedidoI) => {

        setPratoModalProps({
            descricao: prato.descricao,
            id: prato.id,
            idRestaurante: prato.idRestaurante,
            nomePrato: prato.nomePrato,
            urlImagem: prato.urlImagem,
            valor: prato.valor
        })
        setQuantidadePrato(prato.quantidade)

        setOpenModal(!openModal)
    }

    const HandleSelecionarCartao = (id: Guid) => {

        let cartao = Cartoes.find(x => x.idCartao == id)

        if (cartao != undefined)
           setCartaoSelecionado(cartao)

    }
    const HandleSelecionarEndereco = (id:Guid) => {
        let endereco = Enderecos.find(x => x.id == id)

         if(endereco != undefined)      
        setEnderecoSelecionado(endereco)

    }

    
    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
    })


    const HandleConfirmarPedido = async () =>{

        var pratosPedido:PratosOutput[] = pratosSelecionados.map(x => {return {Id:x.id,Quantidade:x.quantidade}})


        const pedido = {IdCartao: CartaoSelecionado.idCartao,IdEndereco: EnderecoSelecionado.id,Pratos:pratosPedido}
        const token = localStorage.getItem("token");
         await toast.promise(
            api.post(`pedidos`, pedido, { headers: { 'Authorization': `Bearer ${token}` } }).then(x => {
                setValorBarraDeProgresso(100)
                setOpenDrawer(!openDrawer)
                setValuePanelPedido(1)
                setOpenPedidoDrawer(!openPedidoDrawer)
                localStorage.setItem("carrinho", "")
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



    return (
        <>
            <React.Fragment >
                <Drawer
                    anchor={'right'}
                    open={openDrawer}
                    onClose={() => {
                        setOpenDrawer(!openDrawer)
                        setValue(0)
                    }}
                >
                    <Box className='Box'
                        sx={{ width: 500 }}
                        role="presentation"
                        onKeyDown={() => {
                            setOpenDrawer(openDrawer)
                            setValue(0)
                        }}
                    >
                        <div className="TopPanel">
                            <h3 className="TituloPassoPedido">{tituloPedido}</h3>
                            <LinearProgressWithLabel id={value >= 4?"displayNone":""} color="error" className="BarraDeProgresso" value={valorBarraDeProgresso} />
                        </div>
                        <TabPanel value={value} index={0}>
                            <div className="DrawerContainerPass1">
                                <div className='DrawerTopPass1'>
                                    {pratosSelecionados?.map(x =>
                                        <div className="PedidoContainer" key={x.id.toString()}>
                                            <div className="DescricaoPrecoPedido">
                                                <span>{x.quantidade}x {x.nomePrato}</span>
                                                <h4>{x.valorTotal}</h4>
                                            </div>
                                            <h4 id="Editar" onClick={() => HandleEditarItemCarrinho(x)}>Editar</h4>
                                            <h4 onClick={() => HandleRemoverItemCarrinho(x.id)}>Remover</h4>
                                            <hr className='DivisorItensPedido' />

                                        </div>)}
                                </div>
                                <div className={pratosSelecionados.length == 0 ? "EnderecoNaoCadastrado" : "displayNone"}>
                                    <h4>Você não selecionou nenhum item</h4>
                                </div>
                                <div className="DrawerBottomPass1">
                                    <div className="DrawerBottomTotal">
                                        <h3>Total</h3>
                                        <span>{ValorTotalPedido} R$</span>
                                    </div>
                                    <Button className='DrawerButtonPass1' variant="contained" color="error" onClick={HandleEscolherEndereco}>
                                        Escolher endereço de entrega
                                    </Button>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <div className="DrawerContainerPass1">
                                <div className='DrawerTopPass1'>
                                    <RadioGroup value={EnderecoSelecionado.id} onChange={(event) => HandleSelecionarEndereco(Guid.parse(event.target.value))}>

                                        {Enderecos.map(x =>
                                            <div className="enderecoBlockContainer" id={x.id.toString()} key={x.id.toString()}>
                                                <div className="enderecoInformation">
                                                    <span id="LinhaPrincipalEndereco">{x.primeiraLinhaEnd}</span>
                                                    <span>{x.segundaLinhaEnd}</span>
                                                </div>
                                                <FormControlLabel value={x.id} control={<Radio color='error' />} label="" />
                                            </div>)}


                                    </RadioGroup>
                                    <div className={"EnderecoNaoCadastrado"}>
                                        <h4 className={Enderecos.length == 0 ? "" : "displayNone"}>Você não possui endereços cadastrados</h4>
                                        <span onClick={() => setOpenEnderecoModal(!openEnderecoModal)}>Adicionar Endereco</span>
                                    </div>

                                </div>
                                <div className="DrawerBottomPass1">

                                    <Button className='DrawerButtonPass1' variant="contained" color="error" onClick={HandleEscolherCartao}>
                                        Escolher froma de pagamento
                                    </Button>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <div className="DrawerContainerPass1">
                                <div className='DrawerTopPass1'>
                                    <RadioGroup value={CartaoSelecionado.idCartao} onChange={(event) => HandleSelecionarCartao(Guid.parse(event.target.value))}>
                                        {Cartoes.map(x =>
                                            <div className=" cartaoBlock" id={x.idCartao.toString()} key={x.idCartao.toString()}>
                                                <img src={ExibirBandeiraCartao(x.bandeira)} />
                                                <span>{x.numeroMascarado}</span>
                                                <FormControlLabel value={x.idCartao} control={<Radio color='error' />} label="" />
                                            </div>)}

                                    </RadioGroup>
                                    <div className={"EnderecoNaoCadastrado"}>
                                        <h4 className={Cartoes.length == 0 ? "" : "displayNone"}>Você não possui cartões cadastrados</h4>
                                        <span onClick={() => setOpenCartaoModal(!openCartaoModal)}>Adicionar Cartão</span>
                                    </div>

                                </div>
                                <div className="DrawerBottomPass1">

                                    <Button className='DrawerButtonPass1' variant="contained" color="error" onClick={HandleRevisarPedidoCartao}>
                                        Escolher froma de pagamento
                                    </Button>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value={value} index={3}>
                            <div className="DrawerContainerPass1">
                                <div className='DrawerTopPass1 ConfirmacaoPedido'>
                                    <h3 id="TituloEnderecoConfirmacao">Endereço</h3>
                                    <span >{EnderecoSelecionado?.primeiraLinhaEnd}, </span>
                                    <span>{EnderecoSelecionado?.segundaLinhaEnd}</span>
                                    
                                    <h3>Resumo valores</h3>
                                    {pratosSelecionados?.map(x =>
                                        <div className="PedidoContainer" key={x.id.toString()}>
                                            <div className="DescricaoPrecoPedido">
                                                <span>{x.quantidade}x {x.nomePrato}</span>
                                                <h4>{x.valorTotal}</h4>
                                            </div>
                                        </div>)}
                                        <h4 className="ValorTotalPedidoConfirmacao">Total {ValorTotalPedido} R$</h4>
                                    <h3>Forma de pagamento</h3>
                                    <div className="cartaoBlockConfirmarPedido">
                                        <h4>Crédito</h4>
                                    <span>{CartaoSelecionado?.numeroMascarado}</span>
                                        <img src={ExibirBandeiraCartao(CartaoSelecionado?.bandeira)} />
                                    </div>

                                </div>
                                <div className="DrawerBottomPass1">

                                    <Button className='DrawerButtonPass1' variant="contained" color="error" onClick={HandleConfirmarPedido}>
                                        Confirmar pedido
                                    </Button>
                                </div>
                            </div>
                        </TabPanel>

                    </Box>

                </Drawer>
                <EnderecoModal />
                <CartaoModal />
            </React.Fragment>

        </>)

}

export default DrawerComponent