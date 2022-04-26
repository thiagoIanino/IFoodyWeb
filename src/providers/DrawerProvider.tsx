import { Guid } from 'guid-typescript';
import { createContext, useContext, useEffect, useState } from 'react';
import { EnderecoProps } from '../components/Drawer';
import { Avaliacao } from '../components/DrawerPedido';
import { ICartao } from '../pages/Login';
import { PratoI, PratoPedidoI } from '../pages/Restaurante';
import { GuidDefault } from '../Utils/BandeiraCartao';


type DrawerContextType = {
    isLogged: boolean
    setOpenPedidoDrawer: (newState: boolean) => void
    openPedidoDrawer: boolean
    setOpenDrawer: (newState: boolean) => void
    openDrawer: boolean
    openModal: boolean
    setOpenModal: (newState: boolean) => void
    openAvaliacaoModal: boolean
    setOpenAvaliacaoModal: (newState: boolean) => void
    tokenAutenticacao: string
    setTokenAutenticacao: (newState: string) => void
    setIsLogged: (newState: boolean) => void
    setPratosSelecionados: (newState: PratoPedidoI[]) => void
    pratosSelecionados: PratoPedidoI[]
    setQuantidadePrato: (newState: number) => void
    QuantidadePrato: number
    setPratoModalProps: (newState: PratoI) => void
    PratoModalProps: PratoI
    setValorTotalPedido: (newState: number) => void
    ValorTotalPedido: number
    setValuePanelPedido: (newState: number) => void
    valuePanelPedido: number
    setRedirectTo: (newState: string) => void
    RedirectTo: string
    setOpenEnderecoModal: (newState: boolean) => void
    openEnderecoModal: boolean
    setEnderecoSelecionado: (newState: EnderecoProps) => void
    EnderecoSelecionado: EnderecoProps 
    setCartaoSelecionado: (newState: ICartao ) => void
    CartaoSelecionado: ICartao 
    setCartoes: (newState: ICartao[]) => void
    Cartoes: ICartao[]
    setOpenCartaoModal: (newState: boolean) => void
    openCartaoModal: boolean
    setOpenPratoModal: (newState: boolean) => void
    openPratoModal: boolean
    setEnderecos: (newState: EnderecoProps[]) => void
    Enderecos: EnderecoProps[]
    setAvaliacoesPendentes: (newState: null | Avaliacao[]) => void
    avaliacoesPendentes: null |Avaliacao[]
}

const initialValue = {
    isLogged: false,
    setOpenDrawer: () => { },
    openDrawer: false,
    setOpenPedidoDrawer: () => { },
    openPedidoDrawer: false,
    openModal: false,
    setOpenModal: () => { },
    openAvaliacaoModal: false,
    setOpenAvaliacaoModal: () => { },
    tokenAutenticacao: "",
    setTokenAutenticacao: () => { },
    setIsLogged: () => { },
    setPratosSelecionados: () => { },
    pratosSelecionados: [] as PratoPedidoI[],
    setQuantidadePrato: () => { },
    QuantidadePrato: 1,
    setValuePanelPedido: () => { },
    valuePanelPedido: 0,
    setPratoModalProps: () => { },
    PratoModalProps: {} as PratoI,
    setValorTotalPedido: () => { },
    ValorTotalPedido: 0,
    setRedirectTo: () => { },
    RedirectTo: "/",
    setOpenEnderecoModal: () => { },
    openEnderecoModal: false,
    setOpenPratoModal: () => { },
    openPratoModal: false,
    setEnderecoSelecionado: () => { },
    EnderecoSelecionado: {id:Guid.create()} as EnderecoProps,
    setCartoes: () => { },
    Cartoes: [] as ICartao[],
    setOpenCartaoModal: () => { },
    openCartaoModal: false,
    setEnderecos: () => { },
    Enderecos: [] as EnderecoProps[],
    setAvaliacoesPendentes: () => { },
    avaliacoesPendentes: [] as Avaliacao[],
    setCartaoSelecionado: () => { },
    CartaoSelecionado: {idCartao:GuidDefault} as ICartao

}

export const DrawerContext = createContext<DrawerContextType>(initialValue)

export type DrawerContextProps = {
    children: React.ReactNode
}

export const DrawerContextProvider = ({ children }: DrawerContextProps) => {

    useEffect(()=>{
        const token = localStorage.getItem("token")
        const pratosPersistidos = localStorage.getItem("carrinho")

        if(token != ""){
            setIsLogged(true)
        }

        if(pratosPersistidos != "" && pratosPersistidos != null ){
            const pratos = JSON.parse(pratosPersistidos)
            setPratosSelecionados(pratos)
        }
    },[])

    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [openPedidoDrawer, setOpenPedidoDrawer] = useState<boolean>(false)
    const [isLogged, setIsLogged] = useState<boolean>(initialValue.isLogged)
    const [openModal, setOpenModal] = useState<boolean>(initialValue.openModal);
    const [openAvaliacaoModal, setOpenAvaliacaoModal] = useState<boolean>(initialValue.openAvaliacaoModal);
    const [tokenAutenticacao, setTokenAutenticacao] = useState<string>(initialValue.tokenAutenticacao);
    const [pratosSelecionados, setPratosSelecionados] = useState<PratoPedidoI[]>(initialValue.pratosSelecionados);
    const [QuantidadePrato, setQuantidadePrato] = useState<number>(initialValue.QuantidadePrato)
    const [PratoModalProps, setPratoModalProps] = useState<PratoI>({} as PratoI)
    const [ValorTotalPedido, setValorTotalPedido] = useState<number>(0)
    const [RedirectTo, setRedirectTo] = useState<string>(initialValue.RedirectTo)
    const [openEnderecoModal, setOpenEnderecoModal] = useState<boolean>(initialValue.openEnderecoModal)
    const [openPratoModal, setOpenPratoModal] = useState<boolean>(initialValue.openPratoModal)
    const [EnderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoProps >(initialValue.EnderecoSelecionado);
    const [CartaoSelecionado, setCartaoSelecionado] = useState<ICartao >(initialValue.CartaoSelecionado);
    const [Cartoes, setCartoes] = useState<ICartao[]>(initialValue.Cartoes);
    const [openCartaoModal, setOpenCartaoModal] = useState(false);
    const [Enderecos, setEnderecos] = useState(initialValue.Enderecos);
    const [valuePanelPedido, setValuePanelPedido] = useState(0);
    const [avaliacoesPendentes, setAvaliacoesPendentes] = useState<null | Avaliacao[]>(null);

    return (
        <DrawerContext.Provider value={{
            isLogged,
            setOpenDrawer,
            openDrawer,
            openModal,
            setOpenModal,
            tokenAutenticacao,
            setTokenAutenticacao,
            setIsLogged,
            pratosSelecionados,
            setPratosSelecionados,
            QuantidadePrato,
            setQuantidadePrato,
            setPratoModalProps,
            PratoModalProps,
            ValorTotalPedido,setValorTotalPedido,
            RedirectTo,
            setRedirectTo,
            openEnderecoModal,
            setOpenEnderecoModal,
            EnderecoSelecionado,
            setEnderecoSelecionado,
            Cartoes,
            setCartoes,
            openCartaoModal,
            setOpenCartaoModal,
            Enderecos,
            setEnderecos,
            CartaoSelecionado,
            setCartaoSelecionado,
            openPedidoDrawer,
            setOpenPedidoDrawer,
            setValuePanelPedido,
            valuePanelPedido,
            openAvaliacaoModal,
            setOpenAvaliacaoModal,
            avaliacoesPendentes,
            setAvaliacoesPendentes,
            openPratoModal,
            setOpenPratoModal
        }}>
            {children}
        </DrawerContext.Provider>


    )
}