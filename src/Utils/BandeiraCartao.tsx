import { useState } from "react"
import Visa from '../assets/Visa.png'
import Master from '../assets/MasterCard.png'
import Elo from '../assets/elo.png'
import { Guid } from "guid-typescript"

export const ExibirBandeiraCartao = (bandeira:string | undefined)=>{

    if(bandeira == "visa")
    return Visa
    else if(bandeira == "masterCard")
    return Master
    else if(bandeira == "elo")
    return Elo
}

export const OpcoesBandeiraCartao = [{nome:"visa",img: Visa},{nome:"masterCard",img: Master},{nome:"elo",img: Elo}]

export const GuidDefault = Guid.parse("00000000-0000-0000-0000-000000000000")