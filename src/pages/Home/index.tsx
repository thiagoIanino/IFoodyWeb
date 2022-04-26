import { useEffect, useState, } from 'react'
import HeaderHome from '../../components/HeaderHome'
import Categorias from '../../Utils/Categorias'
import Destaques from '../../Utils/Destaques'
import StarIcon from '@mui/icons-material/Star';
import './styles.scss'
import { useQuery } from 'react-query'
import axios from 'axios';
import { Guid } from "guid-typescript";
import { Link } from 'react-router-dom';

export type ClassificacaoT = {
  status: number,
  nota: number
}

export interface IRestaurante {
  id: Guid,
  nomeRestaurante: string,
  tipo: string,
  classificacao: ClassificacaoT
  tempoMedioEntrega: number,
  subDescricao: string,
  urlLogo: string

}

const Home = () => {

  const [OpenDrawer, setOpenDrawer] = useState<boolean>(false)

  const { data, isFetching } = useQuery<IRestaurante[]>('topfifteen', async () => {
    const response = await axios.get("http://localhost:26373/api/restaurantes/classificacao")


    return response.data
  }, {
    refetchOnWindowFocus: false,
    staleTime: 5000 * 60
  }
  )

  const HandleSetRestaurant = () => {

    setOpenDrawer(!OpenDrawer)
  }

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
        <h2>Categorias</h2>
        <section className='HomeCategorias'>
          {Categorias.map(x => <Link to={`/restaurantes/categorias/${x.nome}`}key={x.nome} > <div className='CategoriaBlock'><img src={x.img} alt="" /><p>{x.nome}</p></div></Link>)}
        </section>

        <section className="HomeDestaques">
          {Destaques.map(x => (<Link to={`/restaurantes/categorias/${x.nome}`} key={x.nome}><img src={x.img}></img></Link>))}
        </section>


        <h2 className='Famosos'>Top 15 famosos no IFoody</h2>
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

    </>
  )

}

export default Home