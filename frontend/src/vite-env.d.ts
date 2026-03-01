// CSS Module type declarations
declare module '*.module.css' {
    const classes: Record<string, string>
    export default classes
}

// SVG imports
declare module '*.svg' {
    const src: string
    export default src
}

/// <reference types="vite/client" />
