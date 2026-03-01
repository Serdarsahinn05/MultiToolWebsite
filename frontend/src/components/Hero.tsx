import styles from './Hero.module.css'

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            <div className={styles.bgGrid}></div>

            <div className={styles.orbs}>
                <div className={`${styles.orb} ${styles.orb1}`}></div>
                <div className={`${styles.orb} ${styles.orb2}`}></div>
                <div className={`${styles.orb} ${styles.orb3}`}></div>
            </div>

            <div className={styles.content}>
                <div className={styles.badge}>✦ 35+ Free Tools</div>
                <h1 className={styles.title}>
                    Every tool you<br />
                    <span className="gradient-text">ever needed.</span>
                </h1>
                <p className={styles.subtitle}>
                    A beautifully designed suite of calculators, converters, generators,
                    and utilities — all in one place, all free.
                </p>
                <div className={styles.cta}>
                    <a href="#tools" className={styles.btnPrimary}>Explore Tools</a>
                    <a href="#tools" className={styles.btnGhost}>Browse All ↓</a>
                </div>
            </div>
        </section>
    )
}
