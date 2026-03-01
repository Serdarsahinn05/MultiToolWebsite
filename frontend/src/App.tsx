import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import StatsBar from './components/StatsBar.tsx'
import ToolsGrid from './components/ToolsGrid.tsx'
import styles from './App.module.css'
import type { Category } from './data/tools.ts'


const pages = import.meta.glob('./pages/*.tsx', { eager: true });

export default function App() {
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleCategory = (cat: 'all' | Category) => {
    setActiveCategory(cat)
    setSearchQuery('')
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Dashboard (Ana Sayfa) İçeriği
  const MainDashboard = () => (
    <div className={styles.app}>
      <Header
        activeCategory={activeCategory}
        onCategory={handleCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <Hero />
      <StatsBar />
      <ToolsGrid
        activeCategory={activeCategory}
        searchQuery={searchQuery}
      />
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span className={styles.footerIcon}>⚙</span>
            <span className={styles.footerName}>
              ToolKit<span className={styles.footerAccent}>Pro</span>
            </span>
          </div>
          <p className={styles.footerCopy}>© 2026 ToolKit Pro · Developed by Serdarsahinn05.</p>
          <p className={styles.footerTag}>Built for speed. Designed for everyone.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Ana sayfa açıldığında senin mevcut tüm tasarımın gelir */}
        <Route path="/" element={<MainDashboard />} />

        {/* /pages içindeki dosyaları otomatik rotaya çevirir */}
        {Object.keys(pages).map((path) => {
          const name = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
          if (!name || name === 'Dashboard') return null;

          const Component = (pages[path] as any).default;
          // Dosya adını URL dostu yapar: BGRemoverPage -> /bgremoverpage
          return (
            <Route key={name} path={`/${name.toLowerCase()}`} element={<Component />} />
          );
        })}
      </Routes>
    </Router>
  )
}