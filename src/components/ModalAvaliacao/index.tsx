import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DrawerContext } from '../../providers/DrawerProvider';
import './styles.scss'
import Rating from '@mui/material/Rating';
import logo from '../../assets/logoVermelha.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Avaliacao } from '../DrawerPedido';
import { Guid } from 'guid-typescript';

export interface avaliacaoOutput {
  Nota: number
  IdRestaurante:Guid
  IdCliente:Guid
}

export default function ModalAvaliacao() {
  const { openAvaliacaoModal, setOpenAvaliacaoModal, avaliacoesPendentes, setAvaliacoesPendentes, setOpenPedidoDrawer, openPedidoDrawer } = useContext(DrawerContext)
  const [value, setValue] = React.useState<number | null>(null);

  const api = axios.create({
    baseURL: "http://localhost:26373/api/"
  })

  useEffect(()=>{
    console.log(value)
    if(value != null){
      HandleAvaliar()
    }
  },
  [value])

  const HandleAvaliar = async () => {
    let avaliacaoPendente = avaliacoesPendentes != null?avaliacoesPendentes[0] : {} as Avaliacao

    let avaliacao: avaliacaoOutput = {
      IdCliente : avaliacaoPendente.idCliente,
      IdRestaurante : avaliacaoPendente.idRestaurante,
      Nota : value ?? 4
    }

    console.log(avaliacao)
    const token = localStorage.getItem("token");

    await toast.promise(
      api.post(`restaurantes/avaliacao`,avaliacao, { headers: { 'Authorization': `Bearer ${token}` }}).then(x => {
        setOpenAvaliacaoModal(!openAvaliacaoModal)
        setOpenPedidoDrawer(!openPedidoDrawer)
        setValue(null)
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
    <div>

      <Modal
        open={openAvaliacaoModal}
        onClose={() => setOpenAvaliacaoModal(!openAvaliacaoModal)}
      >
        <>

          <div className="ModalAvaliacaoContainer">
            <img src={logo} alt="" />
            <h3>{avaliacoesPendentes != null ? "Avalie " + avaliacoesPendentes[0].nomeRestaurante : ""}</h3>
            <Rating
              id='RatingStars'
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </div>
        </>
      </Modal>
    </div>
  );
}