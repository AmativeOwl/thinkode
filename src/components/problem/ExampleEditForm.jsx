import { useRef, useLayoutEffect } from 'react'

export default function ExampleEditForm({ draft, onChange, onSave, onCancel }) {
    const inputRef = useRef(null)
    const outputRef = useRef(null)

    useLayoutEffect(() => {
        function resize(el) {
            if (!el) return
            el.style.height = 'auto'
            el.style.height = el.scrollHeight + 'px'
        }
        resize(inputRef.current)
        resize(outputRef.current)
    }, [])

    function autoGrow(e) {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    return (
        <>
            <div className="example-tab-fields">
                <div className="example-field">
                    <label>Input</label>
                    <textarea
                        ref={inputRef}
                        value={draft.input}
                        onChange={e => onChange('input', e.target.value)}
                        onInput={autoGrow}
                        placeholder="e.g. nums = [2,7,11,15], target = 9"
                    />
                </div>
                <div className="example-field">
                    <label>Output</label>
                    <textarea
                        ref={outputRef}
                        value={draft.output}
                        onChange={e => onChange('output', e.target.value)}
                        onInput={autoGrow}
                        placeholder="e.g. [0,1]"
                    />
                </div>
            </div>
            <div className="example-edit-footer">
                <button className="example-btn-cancel" onClick={onCancel}>Cancel</button>
                <button className="example-btn-save" onClick={onSave}>Save</button>
            </div>
        </>
    )
}
