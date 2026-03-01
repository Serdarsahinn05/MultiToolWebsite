import { useEffect, useRef, useState } from 'react'
import type { Tool } from '../data/tools.ts'
import styles from './ToolCard.module.css'

interface ToolCardProps {
    tool: Tool
    onOpen: (tool: Tool) => void
}

export default function ToolCard({ tool, onOpen }: ToolCardProps) {
    const [visible, setVisible] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        if (el) obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const handleClick = () => onOpen(tool)

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(tool)
        }
    }

    return (
        <div
            ref={ref}
            className={`${styles.card} ${visible ? styles.visible : ''}`}
            onClick={handleClick}
            onKeyDown={handleKey}
            tabIndex={0}
            role="button"
            aria-label={`Open ${tool.name}`}
        >
            <div className={styles.inner}>
                {/* ── FRONT ── */}
                <div className={`${styles.face} ${styles.front}`} data-cat={tool.category}>
                    <div className={styles.frontBg}></div>
                    <span className={styles.emoji}>{tool.emoji}</span>
                    <div className={styles.frontBottom}>
                        <span className={styles.pill}>{tool.category}</span>
                        <h3 className={styles.frontTitle}>{tool.name}</h3>
                    </div>
                </div>

                {/* ── BACK ── */}
                <div className={`${styles.face} ${styles.back}`}>
                    <div className={styles.backGlow}></div>
                    <div>
                        <div className={styles.backHeader}>
                            <span className={styles.backEmoji}>{tool.emoji}</span>
                            <span className={styles.backTitle}>{tool.name}</span>
                        </div>
                        <p className={styles.desc}>{tool.description}</p>
                    </div>
                    <div className={styles.backFooter}>
                        <span className={styles.openBtn}>Open Tool →</span>
                        <span className={styles.tag}>{tool.tag}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
