import { useState, useEffect, useRef } from 'react'
import { CATEGORIES } from '../data/tools.ts'
import type { Category } from '../data/tools.ts'
import styles from './Header.module.css'

interface HeaderProps {
    activeCategory: 'all' | Category
    onCategory: (cat: 'all' | Category) => void
    searchQuery: string
    onSearch: (q: string) => void
}

export default function Header({ activeCategory, onCategory, searchQuery, onSearch }: HeaderProps) {
    const [scrolled, setScrolled] = useState<boolean>(false)
    const [searchOpen, setSearchOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const toggleSearch = () => {
        setSearchOpen(v => {
            if (!v) setTimeout(() => inputRef.current?.focus(), 80)
            else onSearch('')
            return !v
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)

    const clearSearch = () => {
        onSearch('')
        inputRef.current?.focus()
    }

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                {/* Logo */}
                <a href="#" className={styles.logo}>
                    <span className={styles.logoIcon}>⚙</span>
                    <span className={styles.logoText}>
                        ToolKit<span className={styles.logoAccent}>Pro</span>
                    </span>
                </a>

                {/* Nav */}
                <nav className={styles.nav}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.navBtn} ${activeCategory === cat.id ? styles.navActive : ''}`}
                            onClick={() => onCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>

                {/* Search */}
                <div className={styles.searchWrap}>
                    <button
                        className={`${styles.searchToggle} ${searchOpen ? styles.searchToggleActive : ''}`}
                        onClick={toggleSearch}
                        aria-label="Toggle search"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                    <div className={`${styles.searchBar} ${searchOpen ? styles.searchBarOpen : ''}`}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search tools…"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search tools"
                        />
                        {searchQuery && (
                            <button className={styles.clearBtn} onClick={clearSearch}>✕</button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
