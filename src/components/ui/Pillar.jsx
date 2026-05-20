import "./Pillar.css"

// determines the visual representation of a pillar
export default function Pillar() {
    return (
        <div className="pillar">
            <div className="capital-top"></div>
            <div className="capital"></div>
            <div className="shaft"></div>
            <div className="base"></div>
            <div className="base-foot"></div>
        </div>
    )
}