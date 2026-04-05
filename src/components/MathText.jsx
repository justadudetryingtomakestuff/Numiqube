import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

function MathText({ text }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const html = text.replace(/\$([^$]+)\$/g, (match, math) => {
      try {
        return katex.renderToString(math, { throwOnError: false })
      } catch {
        return match
      }
    })
    ref.current.innerHTML = html
  }, [text])

  return <span ref={ref}>{text}</span>
}

export default MathText