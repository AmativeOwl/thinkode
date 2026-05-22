import { useEffect, useRef, useState } from 'react'
import './Vine.css'

const VINE_WIDTH = 20
const VINE_HEIGHT = 800
export const NUM_WAVES = 10

function generatePath() {
    const waveH = VINE_HEIGHT / NUM_WAVES
    let d = `M${VINE_WIDTH / 2},0`
    for (let i = 0; i < NUM_WAVES; i++) {
        const y0 = i * waveH
        const y1 = (i + 1) * waveH
        const cx = VINE_WIDTH - 1
        d += ` C${cx},${y0 + waveH * 0.37} ${cx},${y1 - waveH * 0.37} ${VINE_WIDTH / 2},${y1}`
    }
    return d
}

const PATH = generatePath()

// Evaluates the exact SVG coordinate at a fractional position [0,1] along the vine
function pointAtFraction(frac) {
    const waveH = VINE_HEIGHT / NUM_WAVES
    const waveFloat = Math.min(frac * NUM_WAVES, NUM_WAVES - 0.0001)
    const wi = Math.floor(waveFloat)
    const t = waveFloat - wi

    const y0 = wi * waveH
    const y1 = (wi + 1) * waveH
    const cx = VINE_WIDTH - 1
    const mx = VINE_WIDTH / 2

    const mt = 1 - t
    const x = mt**3 * mx + 3*mt**2*t * cx + 3*mt*t**2 * cx + t**3 * mx
    const y = mt**3 * y0 + 3*mt**2*t * (y0 + waveH*0.37) + 3*mt*t**2 * (y1 - waveH*0.37) + t**3 * y1
    return { x, y }
}

// The vine column is 40px wide over a 20-unit viewBox → x-scale ≈ 2, y-scale ≈ 1.
// Circles rendered in this stretched space appear flat, so we use ellipses with
// rx = r/2 and ry = r so they render as circles in screen pixels.
function FlowerNode({ fraction, className }) {
    const { x, y } = pointAtFraction(fraction)
    const petals = [0, 72, 144, 216, 288].map(deg => {
        const rad = (deg * Math.PI) / 180
        return { cx: Math.cos(rad) * 2.2, cy: Math.sin(rad) * 4.4 }
    })

    return (
        <g transform={`translate(${x}, ${y})`} className={`vine-flower ${className ?? ''}`}>
            {petals.map(({ cx, cy }, i) => (
                <ellipse key={i} cx={cx} cy={cy} rx="1.3" ry="2.6" />
            ))}
            <ellipse cx="0" cy="0" rx="0.9" ry="1.8" />
        </g>
    )
}

export default function Vine({ scrollRef, progress: staticProgress, flowers }) {
    const pathRef = useRef(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const progress = staticProgress ?? scrollProgress

    // Clip the vine to end just past the last flower
    const maxFraction = flowers?.length
        ? Math.max(...flowers.map(f => f.fraction))
        : 1
    const viewBoxH = maxFraction * VINE_HEIGHT + 12

    useEffect(() => {
        if (staticProgress !== undefined) return
        const el = scrollRef?.current
        if (!el) return
        const onScroll = () => {
            const p = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0
            setScrollProgress(p)
        }
        el.addEventListener('scroll', onScroll)
        return () => el.removeEventListener('scroll', onScroll)
    }, [scrollRef, staticProgress])

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
                viewBox={`0 0 ${VINE_WIDTH} ${viewBoxH}`}
                preserveAspectRatio="none"
                className="vine-svg"
            >
                <path ref={pathRef} d={PATH} className="vine-path" />
                {flowers?.map((flower, i) => (
                    <FlowerNode key={i} fraction={flower.fraction} className={flower.className} />
                ))}
            </svg>
        </div>
    )
}