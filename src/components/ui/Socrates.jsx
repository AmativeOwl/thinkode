import { useState, useEffect, useRef } from 'react'
import socratesRight from '../../assets/socrates-right.png'
import socratesRightMid from '../../assets/socrates-right-mid-stride.png'
import socratesRightStand from '../../assets/socrates-right-stand.png'
import socratesLeft from '../../assets/socrates-left.png'
import socratesLeftMid from '../../assets/socrates-left-mid-stride.png'
import socratesLeftStand from '../../assets/socrates-left-stand.png'
import socratesForward from '../../assets/socrates-forward.png'
import './Socrates.css'

const framesRight = [socratesRightStand, socratesRight, socratesRightMid, socratesRight]
const framesLeft = [socratesLeftStand, socratesLeft, socratesLeftMid, socratesLeft]

export default function Socrates() {
    const [x, setX] = useState(200)
    const [direction, setDirection] = useState('right')
    const [turning, setTurning] = useState(false)
    const [frameIdx, setFrameIdx] = useState(0)
    const directionRef = useRef('right')
    const turningRef = useRef(false)

    useEffect(() => {
        const interval = setInterval(() => {
            if (!turningRef.current) {
                setFrameIdx(prev => (prev + 1) % framesRight.length)
            }
        }, 300)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (turningRef.current) return

            setX(prev => {
                const maxX = window.innerWidth - 200 - 80
                const minX = 200

                if (prev >= maxX && directionRef.current === 'right') {
                    turningRef.current = true
                    setTurning(true)
                    setTimeout(() => {
                        directionRef.current = 'left'
                        setDirection('left')
                        turningRef.current = false
                        setTurning(false)
                    }, 800)
                    return prev
                }

                if (prev < minX && directionRef.current === 'left') {
                    turningRef.current = true
                    setTurning(true)
                    setTimeout(() => {
                        directionRef.current = 'right'
                        setDirection('right')
                        turningRef.current = false
                        setTurning(false)
                    }, 800)
                    return prev
                }

                return directionRef.current === 'right' ? prev + 0.8 : prev - 0.8
            })
        }, 50)

        return () => clearInterval(interval)
    }, [])

    const currentFrames = direction === 'right' ? framesRight : framesLeft
    const src = turning ? socratesForward : currentFrames[frameIdx]

    return (
        <div className="socrates-container" style={{ left: x }}>
            <div className="socrates-walk">
                <img src={src} alt="Socrates" className="socrates-frame" />
            </div>
        </div>
    )
}