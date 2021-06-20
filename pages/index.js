import styles from '../styles/Home.module.css'
import Link from 'next/link'
import GlobeImg from '../public/—Pngtree—vector globe icon_4183764.png'
import Image from 'next/image'
import { useEffect, useState, useCallback } from "react";
export default function Home() {
    const [data, setData] = useState([])
    const [originalData, setOriginalData] = useState([])
    const [country, setCountry] = useState('')
    const [days, setDays] = useState('7')
    useEffect(() => {
        fetch('https://covid-api.mmediagroup.fr/v1/cases', {
            method: 'GET'
        })
            .then(result => {
                return result.json()
            })
            .then(resultJson => {
                let arr = []
                for (const property in resultJson) {
                    arr.push({country: property, info: resultJson[property].All})
                }
                setOriginalData(arr)
                setData(arr)
            })
    }, [])

    const rows = data.map((item, index) => {
        return <tr key={index}>
                <td>{item.country}</td>
                <td>{item.info.confirmed}</td>
                <td>{item.info.recovered}</td>
                <td>{item.info.deaths}</td>
                <td>{Math.round(parseFloat(item.info.deaths / item.info.confirmed) * 100 * 100) / 100} %</td>
            </tr>

    })
    const handleSearch = useCallback((e) => {
        setCountry(e.target.value)
        if (e.target.value) {
            let newData = data.filter(item => item.country.includes(e.target.value))
            setData(newData)
        }
        else {
            setData(originalData)
        }
    }, [country, data])

    const handleSelect = useCallback((e) => {
        setDays(e.target.value)
        if (e.target.value) {
            fetch('https://covid-api.mmediagroup.fr/v1/history?status=deaths', {
                method: 'GET'
            })
                .then(result => {
                    return result.json()
                })
                .then(resultJson => {
                    let arr = []
                    for (const property in resultJson) {
                        arr.push({country: property, info: resultJson[property].All})
                    }
                    setData(arr)
                })
        }
        else {
            // setData(originalData)
        }
    }, [country, data])

    return (
        <div className={styles.container}>
            <Image src={GlobeImg} width={'450'} height={'450'} className={styles.logo}/>
            <div className={styles.toolbar}>
                <div className={styles.searchContainer}>
                    <input className={styles.search} type={'text'} value={country} onChange={e => handleSearch(e)} placeholder={'Country name'}/>
                </div>
                <div>
                    <select className={styles.select} onChange={e => handleSelect(e)} value={days}>
                        <option value={'all'}>All</option>
                        <option value={'7'}>7 days</option>
                        <option value={'6'}>6 days</option>
                        <option value={'5'}>5 days</option>
                        <option value={'4'}>4 days</option>
                        <option value={'3'}>3 days</option>
                        <option value={'2'}>2 days</option>
                        <option value={'1'}>1 day</option>
                    </select>
                </div>


            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Confirmed</th>
                        <th>Rrecovered</th>
                        <th>Deaths</th>
                        <th>Mortality Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}
