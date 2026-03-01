import { useEffect, useCallback } from 'react'
import type { Tool } from '../data/tools.ts'
import styles from './Modal.module.css'
import ToolUI from './ToolUI.tsx'

interface ModalProps {
    tool: Tool | null
    onClose: () => void
}

export default function Modal({ tool, onClose }: ModalProps) {
    const open = !!tool

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        if (open) document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onClose])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const handleBackdrop = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose()
        },
        [onClose]
    )

    return (
        <div
            className={`${styles.backdrop} ${open ? styles.open : ''}`}
            onClick={handleBackdrop}
            aria-hidden={!open}
        >
            <div
                className={`${styles.modal} ${open ? styles.modalOpen : ''}`}
                role="dialog"
                aria-modal={true}
                aria-label={tool?.name}
            >
                {tool && (
                    <>
                        <div className={styles.header}>
                            <div className={styles.titleRow}>
                                <span className={styles.icon}>{tool.emoji}</span>
                                <h2 className={styles.title}>{tool.name}</h2>
                            </div>
                            <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
                        </div>
                        <div className={styles.body}>
                            <p className={styles.desc}>{tool.description}</p>
                            <hr className={styles.divider} />
                            <ToolUI toolId={tool.id} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
