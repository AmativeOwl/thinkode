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
const framesLength = 4

export default function Socrates() {
    const [x, setX] = useState(200)
    const [direction, setDirection] = useState('right')
    const [turning, setTurning] = useState(false)
    const [frameIdx, setFrameIdx] = useState(0)
    const directionRef = useRef('right')
    const turningRef = useRef(false)

    // iterating over the frames every 300ms to create a walking animation, but only if not currently turning
    useEffect(() => {
        const interval = setInterval(() => {
            if (!turningRef.current) {
                setFrameIdx(prev => (prev + 1) % framesLength)
            }
        }, 300)
        return () => clearInterval(interval)
    }, [])

    // Moves Socrates horizontally across the screen, changing direction when reaching the edges. 
    // It uses a setInterval to update the x position every 50ms, and checks if Socrates has reached the left or right bounds (200px and window width - 280px). 
    // When an edge is reached, it triggers a turning animation by setting the turning state and using timeouts to switch direction after 800ms, during which the walking animation is paused.
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

    // Determines which image frame to display based on the current direction and whether Socrates is turning.
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