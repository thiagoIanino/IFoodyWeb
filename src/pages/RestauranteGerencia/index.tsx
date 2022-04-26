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
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { api } from '../Login';
import { toast } from 'react-toastify';

export interface RestauranteCompletoI {
    restaurante: IRestaurante;
    pratosPorClassificacao: PratosPorClassificacaoI[]
}

export enum ClassificacaoPratoE {
    Destaques = 0,
    Classicos = 1,
    Bebidas = 2,
}
export type PratoI = {
    id: Guid;
    nomePrato: string
    descricao: string
    urlImagem: string
    valor: number
    idRestaurante: Guid
}

export type PratoPedidoI = {
    id: Guid;
    nomePrato: string
    descricao: string
    urlImagem: string
    valor: number
    valorTotal: number
    idRestaurante: Guid
    quantidade: number
}

export type PratosPorClassificacaoI = {
    classificacao: ClassificacaoPratoE,
    pratos: PratoI[]
}

export interface RoutePropsI {
    id: string
}

const RestauranteGerencia = () => {

    const location = useLocation()
    let { id } = useParams<RoutePropsI>()
    const { openPratoModal, setOpenPratoModal,setQuantidadePrato,PratoModalProps,setPratoModalProps,pratosSelecionados } = useContext(DrawerContext)



    const { data, isFetching } = useQuery<RestauranteCompletoI>(id, async () => {
        const response = await axios.get(`http://localhost:26373/api/restaurantes/${id}`)
        return response.data
    }
    )


    const ClassificacaoEnumToString = (classificacao: ClassificacaoPratoE) => {
        switch (classificacao) {
            case ClassificacaoPratoE.Bebidas:
                return "Bebidas"
            case ClassificacaoPratoE.Classicos:
                return "Classicos"
            case ClassificacaoPratoE.Destaques:
                return "Destaques"
        }
    }
    const AdequarClassificacacaoRestaurante = (classificacaoRestaurante: ClassificacaoT | undefined) => {
        switch (classificacaoRestaurante?.status) {
            case 0:
                return "Novo!"
            case 1:
                return classificacaoRestaurante?.nota
            
        }
    }

    const HandleExcluirPrato = async (idPrato:Guid) =>{
        const token = localStorage.getItem("token")

        await toast.promise(
            api.delete(`pratos/${idPrato}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(x => {
                toast.success(`Prato deletado com sucesso`);
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
            <HeaderRestaurante />
            <div className="RestauranteContainer">
                
                <div className="RestauranteTopContainer">
                    <div className="LeftSideRestauranteContainer">
                        <img src={data?.restaurante?.urlLogo} alt="" />
                        <h2>{data?.restaurante?.nomeRestaurante}</h2>
                        <StarsIcon />
                    </div>
                    <Button id='BtnAdicionarPrato' onClick={() => setOpenPratoModal(!openPratoModal)} color="error" variant="contained">Adicionar Prato</Button>

                </div>
                <PratoModal/>
                

                <div className="CategoriaContainer">
                <CircularProgress color="error" id= {isFetching ?"circularProgress": "displayNone"}/>
                    {data?.pratosPorClassificacao?.map(x =>
                        <div className="CategoriaContent" key={x.classificacao.toString()}>
                            <h2 id='TituloTipoPrato'>{ClassificacaoEnumToString(x.classificacao)}</h2>
                            {x.pratos?.map(y => <div className="PratoRestauranteContainer" id='blockPedidoGerencia' key={y.id.toString()}>
                                <div className="PratoRestauranteContent" >
                                    <div className="LeftPratoRestaurante">
                                        <div>
                                            <h3 >{y.nomePrato}</h3>
                                            <p id="DescricaoPratoRestaurante">{y.descricao}</p>
                                        </div>
                                        <span>R$ {y.valor}</span>
                                    </div>
                                    <div id='RightSideImgPedido'>
                                    <img src={y.urlImagem} alt="" />
                                    <div onClick={() =>HandleExcluirPrato(y.id)}>
                                    <DeleteIcon id={'TrachIcon'}/>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            )}

                        </div>)}


                </div>


            </div>
        </>
    )
}

export default RestauranteGerencia

