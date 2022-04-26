import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star';
import { useQuery } from 'react-query';
import { ClassificacaoT, IRestaurante } from '../Home';
import axios from 'axios';
import HeaderHome from '../../components/HeaderHome';

export interface RouteRestaurantePropsI {
    categoria: string
}

const RestauranteCategoria = () => {

    let { categoria } = useParams<RouteRestaurantePropsI>()



    const { data, isFetching } = useQuery<IRestaurante[]>(categoria, async () => {
        const response = await axios.get(`http://localhost:26373/api/restaurantes/tipo/${categoria}`)


        return response.data
    }, {
        refetchOnWindowFocus: false
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

    return (
        <>
            <HeaderHome />
            <div className="HomeContainer">
                <h2 className='Famosos'>{categoria}</h2>
                <section className="HomeFamomos">

                    {data?.map(x =>
                        <Link to={`/restaurantes/${x.id}`} key={x.id.toString()}>
                            <div className="RestauranteMini" key={x.id.toString()}>
                                <div className='RestauranteMiniLeftSide'>
                                    <img src={x.urlLogo} alt="" />
                                    <div className="RestauranteMiniDesc">
                                        <h4>{x.nomeRestaurante}</h4>
                                        <p>{x.tipo}  • {x.tempoMedioEntrega} min</p>
                                        <p>{x.subDescricao}</p>
                                    </div>
                                </div>
                                <div className="ClassificacaoRestaurante">
                                    {AdequarClassificacacaoRestaurante(x.classificacao)}
                                    <StarIcon id={x.classificacao.status==0?"displayNone":""}/>
                                </div>
                            </div>
                        </Link>)}
                </section>
            </div>
        </>)
}


export default RestauranteCategoria