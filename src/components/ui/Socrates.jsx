import { useState, useEffect } from 'react'
import socratesRight from '../assets/socrates-right.png'
import socratesMid from '../assets/socrates-mid.png'
import socratesStand from '../assets/socrates-stand.png'
import './Socrates.css'

const frames = [socratesStand, socratesMid, socratesRight, socratesMid]

export default function Socrates() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('frame changing to:', (prev + 1) % frames.length)
            setCurrent(prev => (prev + 1) % frames.length)
        }, 300)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="socrates-walk">
            <img src={frames[current]} alt="Socrates" className="socrates-frame" />
        </div>
    )
}