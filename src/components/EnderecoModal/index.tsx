import { Button, MenuItem, Modal, TextField } from '@mui/material'
import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { DrawerContext } from '../../providers/DrawerProvider'
import { EnderecoProps } from '../Drawer'
import './styles.scss'

export interface EstadoI {
    sigla: string
}
export interface CidadeI {
    nome: string
}

export interface EnderecoI{
    Rua:string
    Numero:number | null
    Apto:number | null
    Bairro:string
    Cidade:string
    Estado:string
}

const EnderecoModal = () => {
    const { openEnderecoModal, setOpenEnderecoModal,Enderecos, setEnderecos } = useContext(DrawerContext)
    const [Rua, setRua] = useState("")
    const [Numero, setNumero] = useState<number | null>(null)
    const [Apto, setApto] = useState<number | null>(null)
    const [Bairro, setBairro] = useState("")
    const [Cidade, setCidade] = useState("")
    const [Cidades, setCidades] = useState<CidadeI[]>([{nome:"Selecione o estado"}] as CidadeI[])
    const [Estado, setEstado] = useState("")
    const [Estados, setEstados] = useState<EstadoI[]>([] as EstadoI[])

    useEffect(() => {
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).then(
            x => {
                setEstados(x.data)
            }
        )

    }, [])

    useEffect(() => {
        if (Estado != "") {
            const response = axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${Estado}/municipios`).then(
                x => {
                    setCidades(x.data)
                })
        }

    }, [Estado])

    const api = axios.create({
        baseURL: "http://localhost:26373/api/"
      })

    const HandleCadastrarEndereco = async () =>{
        const endereco : EnderecoI =  {
            Apto,
            Bairro,
            Cidade,
            Estado,
            Numero,
            Rua

        }
        const token = localStorage.getItem("token")
        
        const response = await toast.promise(
            api.post<EnderecoProps>(`clientes/endereco`, endereco,{headers:{'Authorization':`Bearer ${token}`}}).then(x => {
                setEnderecos([...Enderecos,x.data])
                setOpenEnderecoModal(!openEnderecoModal)
            }),
            {
              pending: 'Processando',
              error: {render:({data})=>{
                return `${data}`
              }}
            })
    }
    


    return (
        <Modal
            open={openEnderecoModal}
            onClose={() => setOpenEnderecoModal(!openEnderecoModal)}
        >
            <div className="ModalContainerEndereco">
                <h3>Endereço</h3>
                <div className="CadastroEnderecoContainer">
                    <div className="CadastroEnderecoContent">
                        <TextField label="Rua" value={Rua} onChange={(event) => setRua(event.target.value)} />
                        <TextField type="number" label="Numero" value={Numero} onChange={(event) => setNumero(Number(event.target.value))} />
                        <TextField type="number" label="Apto" value={Apto} onChange={(event) => setApto(Number(event.target.value))} />
                    </div>
                    <div className="CadastroEnderecoContent">
                        <TextField label="Bairro" value={Bairro} onChange={(event) => setBairro(event.target.value)} />
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            label="Select"

                            value={Estado}
                            onChange={(event) => setEstado(event.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {Estados?.map(x =>
                                <option value={x.sigla} key={x.sigla}>
                                    {x.sigla}
                                </option>)}

                        </TextField>
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            label="Cidade"
                            value={Cidade}
                            onChange={(event) => setCidade(event.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {Cidades?.map(x =>
                                <option value={x.nome} key={x.nome}>
                                    {x.nome}
                                </option>)}

                        </TextField>
                    </div>
                </div>
                <Button onClick={HandleCadastrarEndereco} color="error" variant="contained">Adicionar</Button>
            </div>
        </Modal>
    )
}

export default EnderecoModal