import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import './styles.scss'
import { DrawerContext } from '../../providers/DrawerProvider';

interface quantidadeViwerI{
    setValorPorQuantidade:(value: number)=> void
    valorPrato:number
}

const QuantidadeViewer = (props:quantidadeViwerI) => {

    const { QuantidadePrato,setQuantidadePrato } = useContext(DrawerContext)

    useEffect(()=>{
        props.setValorPorQuantidade(QuantidadePrato * props.valorPrato)
    },[QuantidadePrato])

    const HandleSetQuantidade = (quantidade:number) => {

        setQuantidadePrato(quantidade)
    }

    return (
        <div className="QuantidadeViwer">
            <div className={QuantidadePrato == 1?"opaco":""} onClick={QuantidadePrato == 1 ?() =>{}:()=>HandleSetQuantidade(QuantidadePrato - 1) }>
            <RemoveIcon/>
            </div>
            <span>{QuantidadePrato}</span>
            <div onClick={()=>HandleSetQuantidade(QuantidadePrato + 1)}>
            <AddIcon />
            </div>
        </div>
    )
}

export default QuantidadeViewer