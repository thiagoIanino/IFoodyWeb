import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DrawerContext } from '../../providers/DrawerProvider';
import QuantidadeViewer from '../QuantidadeViewer'
import './styles.scss'
import { PratoI, PratoPedidoI } from '../../pages/Restaurante';
import { idText } from 'typescript';



export default function BasicModal() {
  const { openModal, setOpenModal, setPratosSelecionados, pratosSelecionados, QuantidadePrato, PratoModalProps, setValorTotalPedido } = useContext(DrawerContext)
  const [ValorPorQuantidade, setValorPorQuantidade] = useState<number>(0)

  useEffect(() => {
    setValorPorQuantidade(PratoModalProps.valor)
  }, [openModal])

  useEffect(() => {
    let valorTotal = 0;
    pratosSelecionados.map(x => { valorTotal += x.valorTotal })
    setValorTotalPedido(valorTotal)
  }, [pratosSelecionados])

  const HandleAdicionarAoCarrinho = () => {
    let pratos = pratosSelecionados
    let pratoJaInserido = false
    let pratosAtualizados = pratos.map(x => {
      if (x.id == PratoModalProps.id) {
        x.quantidade = QuantidadePrato
        x.valorTotal = QuantidadePrato * x.valor
        pratoJaInserido = true
      }
      return x
    })

    if (pratoJaInserido == false) {
      const pratoPedido: PratoPedidoI = {
        nomePrato: PratoModalProps.nomePrato,
        descricao: PratoModalProps.descricao,
        urlImagem: PratoModalProps.urlImagem,
        valor: PratoModalProps.valor,
        valorTotal: ValorPorQuantidade,
        id: PratoModalProps.id,
        idRestaurante: PratoModalProps.idRestaurante,
        quantidade: QuantidadePrato
      }
      setPratosSelecionados([...pratosSelecionados,
        pratoPedido])
      localStorage.setItem("carrinho", JSON.stringify([...pratosSelecionados,
        pratoPedido]))
    } else {
      setPratosSelecionados(pratosAtualizados)
      localStorage.setItem("carrinho", JSON.stringify(pratosAtualizados))
    }
    setOpenModal(!openModal)
  }

  return (
    <div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        <div className="ModalContainer">
          <img src={PratoModalProps.urlImagem} alt="" />
          <div className="ModalRightSide">
            <div>
              <h3>{PratoModalProps.nomePrato}</h3>
              <p>{PratoModalProps.descricao}</p>
            </div>
            <div className="ModalRightBottomSide">
              <QuantidadeViewer setValorPorQuantidade={setValorPorQuantidade} valorPrato={PratoModalProps.valor} />
              <Button variant="contained" color="error" onClick={HandleAdicionarAoCarrinho}>
                Adicionar {ValorPorQuantidade} R$
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}