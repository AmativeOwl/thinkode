import { useEffect, useRef, useState } from 'react'
import './Vine.css'

const VINE_WIDTH = 20
const VINE_HEIGHT = 800
const NUM_WAVES = 10

function generatePath() {
    const waveH = VINE_HEIGHT / NUM_WAVES
    let d = `M${VINE_WIDTH / 2},0`
    for (let i = 0; i < NUM_WAVES; i++) {
        const y0 = i * waveH
        const y1 = (i + 1) * waveH
        const cx = i % 2 === 0 ? VINE_WIDTH - 1 : 1
        d += ` C${cx},${y0 + waveH * 0.37} ${cx},${y1 - waveH * 0.37} ${VINE_WIDTH / 2},${y1}`
    }
    return d
}

const PATH = generatePath()

export default function Vine({ scrollRef }) {
    const pathRef = useRef(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const onScroll = () => {
            const p = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0
            setProgress(p)
        }
        el.addEventListener('scroll', onScroll)
        return () => el.removeEventListener('scroll', onScroll)
    }, [scrollRef])

    useEffect(() => {
        const path = pathRef.current
        if (!path) return
        const len = path.getTotalLength()
        path.style.strokeDasharray = len
        path.style.strokeDashoffset = len * (1 - progress)
    }, [progress])

    return (
        <div className="vine">
            <svg
                viewBox={`0 0 ${VINE_WIDTH} ${VINE_HEIGHT}`}
                preserveAspectRatio="none"
                className="vine-svg"
            >
                <path ref={pathRef} d={PATH} className="vine-path" />
            </svg>
        </div>
    )
}
