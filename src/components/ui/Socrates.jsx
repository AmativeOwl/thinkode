import { useState, useEffect } from 'react'
import socratesRight from '../../assets/socrates-right.png'
import socratesMid from '../../assets/socrates-right-mid-stride.png'
import socratesStand from '../../assets/socrates-right-stand.png'
import './Socrates.css'

const frames = [socratesStand, socratesRight, socratesMid, socratesRight]

export default function Socrates() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % frames.length)
        }, 600)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="socrates-container">
            <div className="socrates-walk">
                <img src={frames[current]} alt="Socrates" className="socrates-frame" />
            </div>
        </div>
    )
}