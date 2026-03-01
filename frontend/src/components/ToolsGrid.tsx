/// <reference types="vite/client" />

import { useState, useMemo, useCallback } from 'react'
import { TOOLS } from '../data/tools.ts'
import type { Tool, Category } from '../data/tools.ts'
import ToolCard from './ToolCard.tsx'
import Modal from './Modal.tsx'
import styles from './ToolsGrid.module.css'
import { useNavigate } from 'react-router-dom';

interface ToolsGridProps {
    activeCategory: 'all' | Category;
    searchQuery: string;
}

// Pages klasöründeki tüm .tsx dosyalarını bul ve küçük harfle listele
const dynamicPages = import.meta.glob('../pages/*.tsx');
const availablePages = Object.keys(dynamicPages).map(path => {
    const fileName = path.match(/\.\.\/pages\/(.*)\.tsx$/)?.[1];
    return fileName ? fileName.toLowerCase() : '';
}).filter(name => name !== '' && name !== 'dashboard'); // Dashboard hariç

export default function ToolsGrid({ activeCategory, searchQuery }: ToolsGridProps) {
    const [showExtra, setShowExtra] = useState<boolean>(false)
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

    const filtered = useMemo<Tool[]>(() => {
        let tools: Tool[] = TOOLS

        if (activeCategory !== 'all') {
            tools = tools.filter(t => t.category === activeCategory)
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            tools = tools.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.tag.toLowerCase().includes(q)
            )
        }

        return tools
    }, [activeCategory, searchQuery])

    const initialTools = useMemo<Tool[]>(() => filtered.filter(t => !t.extra), [filtered])
    const extraTools = useMemo<Tool[]>(() => filtered.filter(t => t.extra), [filtered])
    const visibleTools = showExtra ? [...initialTools, ...extraTools] : initialTools
    const hasMore = !showExtra && extraTools.length > 0 && !searchQuery.trim()

    const navigate = useNavigate();

    //  Akıllı ve Tam Otomatik Yönlendirme
    const openModal = useCallback((tool: Tool) => {
        // Tool ID'sindeki özel karakterleri temizle (Örn: 'bg-remover' -> 'bgremover')
        const cleanId = tool.id.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Klasördeki dosyalarla eşleşiyor mu kontrol et ('bgremover' veya 'bgremoverpage' olarak arar)
        const targetPage = availablePages.find(page =>
            page === cleanId || page === `${cleanId}page`
        );

        if (targetPage) {
            // Eşleşen bir Python/Özel sayfa varsa, direkt oraya yönlendir
            navigate(`/${targetPage}`);
        } else {
            // Yoksa eski usul modal aç (Basit JS araçları için)
            setSelectedTool(tool);
        }
    }, [navigate]);

    const closeModal = useCallback(() => setSelectedTool(null), [])

    const sectionTitle =
        activeCategory === 'all'
            ? 'All Tools'
            : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tools`

    return (
        <main className={styles.section} id="tools">
            <div className={styles.header}>
                <h2 className={styles.title}>{sectionTitle}</h2>
                <p className={styles.subtitle}>Hover to preview · Click to open</p>
            </div>

            {searchQuery && (
                <div className={styles.searchNotice}>
                    <span>
                        Showing results for "<strong>{searchQuery}</strong>" —{' '}
                        {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
                    </span>
                </div>
            )}

            {visibleTools.length === 0 ? (
                <p className={styles.noResults}>
                    No tools match your search. Try a different keyword.
                </p>
            ) : (
                <div className={styles.grid}>
                    {visibleTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onOpen={openModal} />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className={styles.loadMoreWrap}>
                    <button className={styles.loadMoreBtn} onClick={() => setShowExtra(true)}>
                        <span>Load More Tools</span>
                        <span className={styles.arrow}>↓</span>
                    </button>
                    <p className={styles.moreHint}>{extraTools.length} more tools available</p>
                </div>
            )}

            <Modal tool={selectedTool} onClose={closeModal} />
        </main>
    )
}