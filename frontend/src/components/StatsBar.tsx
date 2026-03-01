import styles from './StatsBar.module.css'

interface StatItem {
    num: string
    label: string
}

const STATS: StatItem[] = [
    { num: '35+', label: 'Tools' },
    { num: '7', label: 'Categories' },
    { num: '100%', label: 'Free' },
    { num: '0', label: 'Sign-ups' },
]

export default function StatsBar() {
    return (
        <div className={styles.bar}>
            {STATS.map((s, i) => (
                <div key={s.label} className={styles.group}>
                    <div className={styles.item}>
                        <span className={styles.num}>{s.num}</span>
                        <span className={styles.label}>{s.label}</span>
                    </div>
                    {i < STATS.length - 1 && <div className={styles.div}></div>}
                </div>
            ))}
        </div>
    )
}
