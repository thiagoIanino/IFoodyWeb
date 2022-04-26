import { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

const api = axios.create({
    baseURL: "http://localhost:26373/api/"
})

export const useFetch = <T = unknown>(url: string, opts: AxiosRequestConfig) => {
    const [data, setData] = useState<T | null>(null)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState<Error | null>(null)


    useEffect(() => {
        api.get(url)
            .then(response => {
                setData(response.data)
            })
            .catch(err => {
                setError(err)
            })
            .finally(() => {
                setIsFetching(false)
            })
    }, [])

    return { data, isFetching, error }
}