import { useState, useEffect, useRef, useCallback, FC } from 'react'

/* ─── Shared helpers ─────────────────────────────────── */
const Btn: FC<{ onClick: () => void; children: React.ReactNode; secondary?: boolean }> = ({ onClick, children, secondary }) => (
    <button className={`toolBtn${secondary ? ' secondary' : ''}`} onClick={onClick}>{children}</button>
)
const Result: FC<{ value: string; empty?: string }> = ({ value, empty = 'Result will appear here…' }) => (
    <div className={`result${!value ? ' empty' : ''}`}>{value || empty}</div>
)
const Label: FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => <label>{text}{children}</label>
const Row: FC<{ children: React.ReactNode }> = ({ children }) => <div className="row">{children}</div>
const BtnRow: FC<{ children: React.ReactNode }> = ({ children }) => <div className="btnRow">{children}</div>
const Hr: FC = () => <hr className="hr" />
const Hint: FC<{ children: React.ReactNode }> = ({ children }) => <p className="hint">{children}</p>

/* ─── MATH ───────────────────────────────────────────── */
function Calculator() {
    const [expr, setExpr] = useState('')
    const [result, setResult] = useState('')
    const compute = () => {
        try {
            const safe = expr.replace(/\^/g, '**').replace(/sqrt\(/g, 'Math.sqrt(').replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(').replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/pi/gi, 'Math.PI').replace(/e(?!\+|-|\d)/g, 'Math.E')
            // eslint-disable-next-line no-new-func
            setResult(String(Function(`"use strict"; return (${safe})`)()))
        } catch { setResult('❌ Invalid expression') }
    }
    return (
        <div className="toolUi">
            <Label text="Expression"><input value={expr} onChange={e => setExpr(e.target.value)} placeholder="e.g. 2^10 + sqrt(144)" onKeyDown={e => e.key === 'Enter' && compute()} /></Label>
            <Hint>Supports: + - * / ^ sqrt() sin() cos() tan() log() ln() pi e</Hint>
            <Btn onClick={compute}>Calculate</Btn>
            <Result value={result} />
        </div>
    )
}

function Percentage() {
    const [a, setA] = useState(''); const [b, setB] = useState(''); const [result, setResult] = useState('')
    const calc = () => {
        const na = parseFloat(a), nb = parseFloat(b)
        if (isNaN(na) || isNaN(nb)) { setResult('Enter valid numbers'); return }
        setResult(`${na} is ${(na / nb * 100).toFixed(4)}% of ${nb}\nChange from ${na} to ${nb}: ${((nb - na) / na * 100).toFixed(4)}%\n${na}% of ${nb} = ${(na / 100 * nb).toFixed(4)}`)
    }
    return (
        <div className="toolUi">
            <Row>
                <Label text="Value A"><input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="45" /></Label>
                <Label text="Value B"><input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="200" /></Label>
            </Row>
            <Btn onClick={calc}>Calculate</Btn>
            <Result value={result} empty="Results will appear here…" />
        </div>
    )
}

function BMI() {
    const [unit, setUnit] = useState('metric'); const [weight, setWeight] = useState(''); const [height, setHeight] = useState(''); const [result, setResult] = useState('')
    const calc = () => {
        const bmi = unit === 'metric' ? parseFloat(weight) / (parseFloat(height) / 100) ** 2 : (parseFloat(weight) / parseFloat(height) ** 2) * 703
        if (isNaN(bmi)) { setResult('Enter valid values'); return }
        const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'
        setResult(`BMI: ${bmi.toFixed(2)}\nCategory: ${cat}`)
    }
    return (
        <div className="toolUi">
            <Label text="Unit System"><select value={unit} onChange={e => setUnit(e.target.value)}><option value="metric">Metric (kg / cm)</option><option value="imperial">Imperial (lb / in)</option></select></Label>
            <Row>
                <Label text={unit === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}><input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" /></Label>
                <Label text={unit === 'metric' ? 'Height (cm)' : 'Height (in)'}><input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" /></Label>
            </Row>
            <Btn onClick={calc}>Calculate BMI</Btn>
            <Result value={result} empty="BMI will appear here…" />
        </div>
    )
}

function Prime() {
    const [num, setNum] = useState(''); const [result, setResult] = useState('')
    const check = () => {
        const n = parseInt(num)
        if (isNaN(n) || n < 2) { setResult('Enter a number ≥ 2'); return }
        const factors: number[] = []
        let isPrime = true
        for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { isPrime = false; factors.push(i, n / i) } }
        setResult(isPrime ? `✅ ${n} IS prime` : `❌ ${n} is NOT prime\nFactors: ${[...new Set(factors)].sort((a, b) => a - b).join(', ')}`)
    }
    return (
        <div className="toolUi">
            <Label text="Number"><input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="97" onKeyDown={e => e.key === 'Enter' && check()} /></Label>
            <Btn onClick={check}>Check</Btn>
            <Result value={result} />
        </div>
    )
}

function Fibonacci() {
    const [n, setN] = useState(''); const [result, setResult] = useState('')
    const gen = () => {
        const count = Math.min(parseInt(n) || 10, 50)
        const seq = [0, 1]
        for (let i = 2; i < count; i++) seq.push(seq[i - 1] + seq[i - 2])
        setResult(seq.slice(0, count).join(', '))
    }
    return (
        <div className="toolUi">
            <Label text="Number of Terms (max 50)"><input type="number" value={n} onChange={e => setN(e.target.value)} placeholder="10" min="1" max="50" /></Label>
            <Btn onClick={gen}>Generate</Btn>
            <Result value={result} empty="Sequence will appear here…" />
        </div>
    )
}

function Loan() {
    const [p, setP] = useState(''); const [r, setR] = useState(''); const [t, setT] = useState(''); const [result, setResult] = useState('')
    const calc = () => {
        const P = parseFloat(p), annual = parseFloat(r) / 100, years = parseFloat(t)
        if ([P, annual, years].some(isNaN)) { setResult('Enter all fields'); return }
        const R = annual / 12, N = years * 12
        const monthly = R === 0 ? P / N : P * (R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
        const total = monthly * N
        setResult(`Monthly Payment: $${monthly.toFixed(2)}\nTotal Payment: $${total.toFixed(2)}\nTotal Interest: $${(total - P).toFixed(2)}`)
    }
    return (
        <div className="toolUi">
            <Label text="Principal ($)"><input type="number" value={p} onChange={e => setP(e.target.value)} placeholder="100000" /></Label>
            <Row>
                <Label text="Annual Rate (%)"><input type="number" value={r} onChange={e => setR(e.target.value)} placeholder="5.5" step="0.1" /></Label>
                <Label text="Term (years)"><input type="number" value={t} onChange={e => setT(e.target.value)} placeholder="30" /></Label>
            </Row>
            <Btn onClick={calc}>Calculate</Btn>
            <Result value={result} empty="Results will appear here…" />
        </div>
    )
}

/* ─── CONVERT ────────────────────────────────────────── */
type UnitCat = 'length' | 'weight' | 'temperature' | 'speed'
const UNITS: Record<UnitCat, Record<string, string>> = {
    length: { m: 'Meters', km: 'Kilometers', mi: 'Miles', ft: 'Feet', in: 'Inches', cm: 'Centimeters' },
    weight: { kg: 'Kilograms', g: 'Grams', lb: 'Pounds', oz: 'Ounces', t: 'Metric Tons' },
    temperature: { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' },
    speed: { ms: 'm/s', kmh: 'km/h', mph: 'mph', knot: 'Knots' },
}
const TO_BASE: Record<string, number> = { m: 1, km: 1000, mi: 1609.344, ft: 0.3048, in: 0.0254, cm: 0.01, kg: 1, g: 0.001, lb: 0.453592, oz: 0.028350, t: 1000, ms: 1, kmh: 1 / 3.6, mph: 0.44704, knot: 0.514444 }
function convertTemp(val: number, from: string, to: string): number {
    const c = from === 'f' ? (val - 32) * 5 / 9 : from === 'k' ? val - 273.15 : val
    return to === 'f' ? c * 9 / 5 + 32 : to === 'k' ? c + 273.15 : c
}

function UnitConverter() {
    const [cat, setCat] = useState<UnitCat>('length')
    const keys = Object.keys(UNITS[cat])
    const [from, setFrom] = useState(keys[0]); const [to, setTo] = useState(keys[1])
    const [val, setVal] = useState(''); const [result, setResult] = useState('')
    useEffect(() => { const k = Object.keys(UNITS[cat]); setFrom(k[0]); setTo(k[1]); setResult('') }, [cat])
    const convert = () => {
        const v = parseFloat(val)
        if (isNaN(v)) { setResult('Enter a number'); return }
        const res = cat === 'temperature' ? convertTemp(v, from, to) : v * (TO_BASE[from] ?? 1) / (TO_BASE[to] ?? 1)
        setResult(`${v} ${from.toUpperCase()} = ${res.toFixed(6)} ${to.toUpperCase()}`)
    }
    return (
        <div className="toolUi">
            <Label text="Category"><select value={cat} onChange={e => setCat(e.target.value as UnitCat)}>{(Object.keys(UNITS) as UnitCat[]).map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}</select></Label>
            <Row>
                <Label text="From"><select value={from} onChange={e => setFrom(e.target.value)}>{Object.entries(UNITS[cat]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Label>
                <Label text="To"><select value={to} onChange={e => setTo(e.target.value)}>{Object.entries(UNITS[cat]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Label>
            </Row>
            <Label text="Value"><input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="1" onKeyDown={e => e.key === 'Enter' && convert()} /></Label>
            <Btn onClick={convert}>Convert</Btn>
            <Result value={result} />
        </div>
    )
}

const RATES: Record<string, number> = { USD: 1, EUR: 0.918, GBP: 0.786, JPY: 149.5, CAD: 1.358, AUD: 1.533, CHF: 0.887, CNY: 7.22, INR: 83.1, TRY: 32.1 }
function Currency() {
    const [from, setFrom] = useState('USD'); const [to, setTo] = useState('EUR'); const [amt, setAmt] = useState(''); const [result, setResult] = useState('')
    const convert = () => {
        const a = parseFloat(amt)
        if (isNaN(a)) { setResult('Enter an amount'); return }
        setResult(`${a} ${from} ≈ ${(a / RATES[from] * RATES[to]).toFixed(2)} ${to}`)
    }
    const currencies = Object.keys(RATES)
    return (
        <div className="toolUi">
            <Row>
                <Label text="From"><select value={from} onChange={e => setFrom(e.target.value)}>{currencies.map(c => <option key={c} value={c}>{c}</option>)}</select></Label>
                <Label text="To"><select value={to} onChange={e => setTo(e.target.value)}>{currencies.map(c => <option key={c} value={c}>{c}</option>)}</select></Label>
            </Row>
            <Label text="Amount"><input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="100" onKeyDown={e => e.key === 'Enter' && convert()} /></Label>
            <Btn onClick={convert}>Convert</Btn>
            <Result value={result} />
            <Hint>⚠ Approximate rates. Not for financial decisions.</Hint>
        </div>
    )
}

function NumberBase() {
    const [from, setFrom] = useState('10'); const [to, setTo] = useState('16'); const [val, setVal] = useState(''); const [result, setResult] = useState('')
    const convert = () => { try { setResult(parseInt(val, parseInt(from)).toString(parseInt(to)).toUpperCase()) } catch { setResult('❌ Invalid value') } }
    const bases: [string, string][] = [['2', 'Binary'], ['8', 'Octal'], ['10', 'Decimal'], ['16', 'Hexadecimal']]
    return (
        <div className="toolUi">
            <Row>
                <Label text="From Base"><select value={from} onChange={e => setFrom(e.target.value)}>{bases.map(([v, l]) => <option key={v} value={v}>{l} ({v})</option>)}</select></Label>
                <Label text="To Base"><select value={to} onChange={e => setTo(e.target.value)}>{bases.map(([v, l]) => <option key={v} value={v}>{l} ({v})</option>)}</select></Label>
            </Row>
            <Label text="Value"><input value={val} onChange={e => setVal(e.target.value)} placeholder="e.g. 255" onKeyDown={e => e.key === 'Enter' && convert()} /></Label>
            <Btn onClick={convert}>Convert</Btn>
            <Result value={result} />
        </div>
    )
}

function Roman() {
    const [num, setNum] = useState(''); const [str, setStr] = useState(''); const [result, setResult] = useState('')
    const toR = () => {
        let n = parseInt(num)
        if (isNaN(n) || n < 1 || n > 3999) { setResult('Enter 1–3999'); return }
        const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
        const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
        let r = ''
        vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v } })
        setResult(r)
    }
    const fromR = () => {
        const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
        const s = str.toUpperCase(); let total = 0
        for (let i = 0; i < s.length; i++) {
            const cur = map[s[i]], next = map[s[i + 1]]
            if (!cur) { setResult('❌ Invalid Roman numeral'); return }
            total += next && cur < next ? -cur : cur
        }
        setResult(String(total))
    }
    return (
        <div className="toolUi">
            <Label text="Number (1–3999)"><input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="2024" /></Label>
            <Btn onClick={toR}>Convert to Roman</Btn>
            <Hr />
            <Label text="Roman Numeral"><input value={str} onChange={e => setStr(e.target.value)} placeholder="MMXXIV" style={{ textTransform: 'uppercase' }} /></Label>
            <Btn onClick={fromR}>Convert to Number</Btn>
            <Result value={result} />
        </div>
    )
}

function ColorConv() {
    const [hex, setHex] = useState('#00D9C0'); const [info, setInfo] = useState('')
    const update = (h: string) => {
        setHex(h)
        const c = h.replace('#', '')
        if (!/^[0-9A-Fa-f]{6}$/.test(c)) { setInfo(''); return }
        const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
        const rf = r / 255, gf = g / 255, bf = b / 255, max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf), d = max - min
        let hue = 0; const lig = (max + min) / 2; const sat = d ? (d / (1 - Math.abs(2 * lig - 1))) : 0
        if (d) { hue = max === rf ? ((gf - bf) / d + 6) % 6 : max === gf ? (bf - rf) / d + 2 : (rf - gf) / d + 4; hue = Math.round(hue * 60) }
        setInfo(`RGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hue}, ${Math.round(sat * 100)}%, ${Math.round(lig * 100)}%)\nR:${r}  G:${g}  B:${b}`)
    }
    return (
        <div className="toolUi">
            <Label text="HEX Color"><input value={hex} onChange={e => update(e.target.value)} placeholder="#00D9C0" maxLength={7} /></Label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: hex, border: '1px solid var(--border)', flexShrink: 0, transition: 'background 0.3s' }} />
                <Result value={info} empty="Enter a valid HEX color" />
            </div>
        </div>
    )
}

/* ─── TEXT ───────────────────────────────────────────── */
function WordCount() {
    const [text, setText] = useState('')
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    return (
        <div className="toolUi">
            <Label text="Your Text"><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text here…" rows={5} /></Label>
            <div className="result" style={{ fontFamily: 'var(--font-main)', fontSize: '0.87rem' }}>
                {text ? `Words: ${words}  |  Characters: ${text.length}  |  Sentences: ${sentences}  |  ~${Math.ceil(words / 238)} min read` : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Stats update as you type…</span>}
            </div>
        </div>
    )
}

function CaseConv() {
    const [input, setInput] = useState(''); const [output, setOutput] = useState('')
    const convert = (type: string) => {
        const cases: Record<string, string> = {
            upper: input.toUpperCase(), lower: input.toLowerCase(),
            title: input.replace(/\b\w/g, c => c.toUpperCase()),
            sentence: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
            camel: input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase()),
            snake: input.toLowerCase().replace(/\s+/g, '_'),
        }
        setOutput(cases[type] ?? input)
    }
    const cases: [string, string][] = [['upper', 'UPPERCASE'], ['lower', 'lowercase'], ['title', 'Title Case'], ['sentence', 'Sentence case'], ['camel', 'camelCase'], ['snake', 'snake_case']]
    return (
        <div className="toolUi">
            <Label text="Input Text"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste text…" rows={3} /></Label>
            <div className="btnRow">{cases.map(([k, l]) => <button key={k} className="toolBtn" style={{ fontSize: '0.8rem', padding: '8px' }} onClick={() => convert(k)}>{l}</button>)}</div>
            <Label text="Output"><textarea value={output} readOnly rows={3} placeholder="Result…" /></Label>
        </div>
    )
}

const LOREM_S = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.']
const LOREM_W = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor labore magna aliqua enim veniam nostrud ullamco'.split(' ')

function Lorem() {
    const [type, setType] = useState('paragraphs'); const [count, setCount] = useState(3); const [output, setOutput] = useState('')
    const gen = () => {
        if (type === 'words') { setOutput(Array.from({ length: count }, () => LOREM_W[Math.floor(Math.random() * LOREM_W.length)]).join(' ')); return }
        if (type === 'sentences') { setOutput(Array.from({ length: count }, (_, i) => LOREM_S[i % LOREM_S.length]).join(' ')); return }
        setOutput(Array.from({ length: count }, (_, i) => LOREM_S.slice(i % 3, (i % 3) + 3).join(' ')).join('\n\n'))
    }
    return (
        <div className="toolUi">
            <Row>
                <Label text="Type"><select value={type} onChange={e => setType(e.target.value)}><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></Label>
                <Label text="Count"><input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} min={1} max={20} /></Label>
            </Row>
            <Btn onClick={gen}>Generate</Btn>
            <Label text="Output"><textarea value={output} readOnly rows={6} placeholder="Lorem ipsum will appear here…" /></Label>
        </div>
    )
}

function Palindrome() {
    const [text, setText] = useState(''); const [result, setResult] = useState('')
    const check = () => {
        const s = text.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (!s) { setResult('Enter text to check'); return }
        const is = s === s.split('').reverse().join('')
        setResult(is ? `✅ "${text}" IS a palindrome!` : `❌ "${text}" is NOT a palindrome.`)
    }
    return (
        <div className="toolUi">
            <Label text="Text to Check"><input value={text} onChange={e => setText(e.target.value)} placeholder="A man a plan a canal Panama" onKeyDown={e => e.key === 'Enter' && check()} /></Label>
            <Btn onClick={check}>Check</Btn>
            <Result value={result} />
        </div>
    )
}

/* ─── COLOR ──────────────────────────────────────────── */
function hslToHex(h: number, s: number, l: number): string { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l); const f = (n: number) => { const k = (n + h / 30) % 12; const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, '0') }; return `#${f(0)}${f(8)}${f(4)}` }
function hexToHsl(hex: string): [number, number, number] { const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255; const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min; let h = 0; const l = (max + min) / 2; const s = d ? (d / (1 - Math.abs(2 * l - 1))) : 0; if (d) { h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h = Math.round(h * 60) } return [h, Math.round(s * 100), Math.round(l * 100)] }

interface Swatch { label: string; hex: string }
function Palette() {
    const [base, setBase] = useState('#00D9C0'); const [swatches, setSwatches] = useState<Swatch[]>([])
    const gen = useCallback((hex: string) => {
        setBase(hex)
        const [h, s, l] = hexToHsl(hex)
        setSwatches([
            { label: 'Base', hex }, { label: 'Complementary', hex: hslToHex((h + 180) % 360, s, l) },
            { label: 'Triadic 1', hex: hslToHex((h + 120) % 360, s, l) }, { label: 'Triadic 2', hex: hslToHex((h + 240) % 360, s, l) },
            { label: 'Analogous+', hex: hslToHex((h + 30) % 360, s, l) }, { label: 'Analogous-', hex: hslToHex((h - 30 + 360) % 360, s, l) },
            { label: 'Lighter', hex: hslToHex(h, s, Math.min(l + 20, 95)) }, { label: 'Darker', hex: hslToHex(h, s, Math.max(l - 20, 5)) },
        ])
    }, [])
    useEffect(() => gen(base), [])
    return (
        <div className="toolUi">
            <Label text="Base Color"><input type="color" value={base} onChange={e => gen(e.target.value)} style={{ height: 48, cursor: 'pointer', padding: 4 }} /></Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {swatches.map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, background: s.hex, border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(s.hex)} title="Click to copy" />
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.label}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--teal)', fontFamily: 'monospace' }}>{s.hex}</span>
                    </div>
                ))}
            </div>
            <Hint>Click any swatch to copy its HEX value.</Hint>
        </div>
    )
}

function Contrast() {
    const [fg, setFg] = useState('#ffffff'); const [bg, setBg] = useState('#0a0a0f'); const [result, setResult] = useState('')
    const lum = (hex: string) => { const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255; const t = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); return 0.2126 * t(r) + 0.7152 * t(g) + 0.0722 * t(b) }
    const check = () => {
        const l1 = lum(fg), l2 = lum(bg), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
        setResult(`Ratio: ${ratio.toFixed(2)}:1\nAA Normal: ${ratio >= 4.5 ? '✅ Pass' : '❌ Fail'}\nAAA Enhanced: ${ratio >= 7 ? '✅ Pass' : '❌ Fail'}`)
    }
    return (
        <div className="toolUi">
            <Row>
                <Label text="Foreground"><input type="color" value={fg} onChange={e => setFg(e.target.value)} style={{ height: 48, cursor: 'pointer', padding: 4 }} /></Label>
                <Label text="Background"><input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ height: 48, cursor: 'pointer', padding: 4 }} /></Label>
            </Row>
            <div style={{ background: bg, color: fg, borderRadius: 10, padding: '16px 20px', textAlign: 'center', fontWeight: 600, border: '1px solid var(--border)', transition: 'all 0.3s' }}>Sample Text Preview</div>
            <Btn onClick={check}>Check Contrast</Btn>
            <Result value={result} />
        </div>
    )
}

function Gradient() {
    const [c1, setC1] = useState('#00D9C0'); const [c2, setC2] = useState('#7c3aed'); const [type, setType] = useState('linear-gradient'); const [angle, setAngle] = useState(135)
    const css = type === 'linear-gradient' ? `${type}(${angle}deg, ${c1}, ${c2})` : `${type}(circle, ${c1}, ${c2})`
    return (
        <div className="toolUi">
            <Row>
                <Label text="Color 1"><input type="color" value={c1} onChange={e => setC1(e.target.value)} style={{ height: 48, cursor: 'pointer', padding: 4 }} /></Label>
                <Label text="Color 2"><input type="color" value={c2} onChange={e => setC2(e.target.value)} style={{ height: 48, cursor: 'pointer', padding: 4 }} /></Label>
            </Row>
            <Row>
                <Label text="Type"><select value={type} onChange={e => setType(e.target.value)}><option>linear-gradient</option><option>radial-gradient</option></select></Label>
                <Label text="Angle (°)"><input type="number" value={angle} onChange={e => setAngle(Number(e.target.value))} min={0} max={360} /></Label>
            </Row>
            <div style={{ height: 80, borderRadius: 12, background: css, border: '1px solid var(--border)', transition: 'background 0.3s' }} />
            <div className="result" style={{ cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => navigator.clipboard.writeText(`background: ${css};`)}>background: {css}; <span style={{ color: 'var(--text-muted)' }}>— click to copy</span></div>
        </div>
    )
}

/* ─── WEB ────────────────────────────────────────────── */
function HtmlEnc() {
    const [input, setInput] = useState(''); const [output, setOutput] = useState('')
    const encode = () => setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'))
    const decode = () => { const d = document.createElement('div'); d.innerHTML = input; setOutput(d.textContent ?? '') }
    return (
        <div className="toolUi">
            <Label text="Input"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type HTML or plain text…" rows={4} /></Label>
            <BtnRow><Btn onClick={encode}>Encode →</Btn><Btn onClick={decode} secondary>← Decode</Btn></BtnRow>
            <Label text="Output"><textarea value={output} readOnly rows={4} placeholder="Result…" /></Label>
        </div>
    )
}

function UrlEnc() {
    const [input, setInput] = useState(''); const [output, setOutput] = useState('')
    return (
        <div className="toolUi">
            <Label text="Input"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste URL or text…" rows={3} /></Label>
            <BtnRow>
                <Btn onClick={() => setOutput(encodeURIComponent(input))}>Encode →</Btn>
                <Btn onClick={() => { try { setOutput(decodeURIComponent(input)) } catch { setOutput('❌ Invalid') } }} secondary>← Decode</Btn>
            </BtnRow>
            <Label text="Output"><textarea value={output} readOnly rows={3} placeholder="Result…" /></Label>
        </div>
    )
}

function Base64Tool() {
    const [input, setInput] = useState(''); const [output, setOutput] = useState('')
    return (
        <div className="toolUi">
            <Label text="Input"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text or Base64…" rows={3} /></Label>
            <BtnRow>
                <Btn onClick={() => setOutput(btoa(unescape(encodeURIComponent(input))))}>Encode →</Btn>
                <Btn onClick={() => { try { setOutput(decodeURIComponent(escape(atob(input)))) } catch { setOutput('❌ Invalid Base64') } }} secondary>← Decode</Btn>
            </BtnRow>
            <Label text="Output"><textarea value={output} readOnly rows={3} placeholder="Result…" /></Label>
        </div>
    )
}

function JsonFmt() {
    const [input, setInput] = useState(''); const [output, setOutput] = useState('')
    const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, 2)) } catch { setOutput('❌ Invalid JSON') } }
    return (
        <div className="toolUi">
            <Label text="Raw JSON"><textarea value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder='{"key":"value"}' style={{ fontFamily: 'monospace' }} /></Label>
            <Btn onClick={format}>Format JSON</Btn>
            <Label text="Formatted Output"><textarea value={output} readOnly rows={6} style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} /></Label>
        </div>
    )
}

/* ─── TIME ───────────────────────────────────────────── */
function Unix() {
    const [ts, setTs] = useState(''); const [dateIn, setDateIn] = useState(''); const [r1, setR1] = useState(''); const [r2, setR2] = useState('')
    const [now, setNow] = useState(Math.floor(Date.now() / 1000))
    useEffect(() => { const iv = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000); return () => clearInterval(iv) }, [])
    return (
        <div className="toolUi">
            <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', textAlign: 'center' }}>Now: <span style={{ color: 'var(--teal)', fontFamily: 'monospace' }}>{now}</span></div>
            <Label text="Unix Timestamp → Date"><input type="number" value={ts} onChange={e => setTs(e.target.value)} placeholder="1700000000" /></Label>
            <Btn onClick={() => setR1(new Date(parseInt(ts) * 1000).toLocaleString())}>Convert to Date</Btn>
            <Result value={r1} empty="Date will appear here…" />
            <Hr />
            <Label text="Date → Unix Timestamp"><input type="datetime-local" value={dateIn} onChange={e => setDateIn(e.target.value)} /></Label>
            <Btn onClick={() => setR2(String(Math.floor(new Date(dateIn).getTime() / 1000)))}>Convert to Timestamp</Btn>
            <Result value={r2} empty="Timestamp will appear here…" />
        </div>
    )
}

function Age() {
    const [dob, setDob] = useState(''); const [result, setResult] = useState('')
    const calc = () => {
        const b = new Date(dob), n = new Date()
        if (isNaN(b.getTime())) { setResult('Select a date'); return }
        let y = n.getFullYear() - b.getFullYear(), m = n.getMonth() - b.getMonth(), d = n.getDate() - b.getDate()
        if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate() }
        if (m < 0) { y--; m += 12 }
        setResult(`${y} years, ${m} months, ${d} days\n≈ ${Math.floor((n.getTime() - b.getTime()) / 864e5).toLocaleString()} days total`)
    }
    return (
        <div className="toolUi">
            <Label text="Date of Birth"><input type="date" value={dob} onChange={e => setDob(e.target.value)} /></Label>
            <Btn onClick={calc}>Calculate Age</Btn>
            <Result value={result} empty="Your age will appear here…" />
        </div>
    )
}

function Countdown() {
    const [target, setTarget] = useState(''); const [display, setDisplay] = useState('—')
    const ivRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const start = () => {
        if (ivRef.current) clearInterval(ivRef.current)
        const t = new Date(target).getTime()
        if (isNaN(t)) { setDisplay('Invalid date'); return }
        const tick = () => {
            const diff = t - Date.now()
            if (diff <= 0) { setDisplay('🎉 Time is up!'); if (ivRef.current) clearInterval(ivRef.current); return }
            const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3)
            setDisplay(`${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`)
        }
        tick(); ivRef.current = setInterval(tick, 1000)
    }
    useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current) }, [])
    return (
        <div className="toolUi">
            <Label text="Target Date & Time"><input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} /></Label>
            <Btn onClick={start}>Start Countdown</Btn>
            <div className="result" style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', textAlign: 'center', letterSpacing: 2, color: 'var(--teal)' }}>{display}</div>
        </div>
    )
}

/* ─── EXTRA ──────────────────────────────────────────── */
function Password() {
    const [len, setLen] = useState(16); const [upper, setUpper] = useState(true); const [lower, setLower] = useState(true); const [digits, setDigits] = useState(true); const [sym, setSym] = useState(false); const [result, setResult] = useState('')
    const gen = () => {
        let chars = ''; if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (lower) chars += 'abcdefghijklmnopqrstuvwxyz'; if (digits) chars += '0123456789'; if (sym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        if (!chars) { setResult('Select at least one character set'); return }
        setResult(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    }
    return (
        <div className="toolUi">
            <Label text={`Length: ${len}`}><input type="range" min={8} max={64} value={len} onChange={e => setLen(Number(e.target.value))} /></Label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {([['Uppercase', upper, setUpper], ['Lowercase', lower, setLower], ['Numbers', digits, setDigits], ['Symbols', sym, setSym]] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([l, v, s]) => (
                    <label key={l as string} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, textTransform: 'none', fontSize: '0.85rem' }}>
                        <input type="checkbox" checked={v as boolean} onChange={e => s(e.target.checked)} />{l as string}
                    </label>
                ))}
            </div>
            <Btn onClick={gen}>Generate Password</Btn>
            <div className="result" style={{ cursor: 'pointer', fontSize: '0.85rem', wordBreak: 'break-all' }} onClick={() => result && navigator.clipboard.writeText(result)}>
                {result || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Password will appear here…</span>}
            </div>
        </div>
    )
}

function UUID() {
    const [count, setCount] = useState(5); const [result, setResult] = useState('')
    const gen = () => {
        const uuids = Array.from({ length: Math.min(count, 20) }, () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : r & 3 | 8).toString(16) }))
        setResult(uuids.join('\n'))
    }
    return (
        <div className="toolUi">
            <Label text="Count (1–20)"><input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} min={1} max={20} /></Label>
            <Btn onClick={gen}>Generate UUIDs</Btn>
            <div className="result" style={{ fontSize: '0.77rem', lineHeight: 1.9, cursor: 'pointer' }} onClick={() => result && navigator.clipboard.writeText(result)}>
                {result || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>UUIDs will appear here…</span>}
            </div>
        </div>
    )
}

async function sha256(msg: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
function Hash() {
    const [input, setInput] = useState(''); const [result, setResult] = useState('')
    const gen = async () => { if (!input) { setResult('Enter text'); return }; setResult(`SHA-256:\n${await sha256(input)}`) }
    return (
        <div className="toolUi">
            <Label text="Input Text"><textarea value={input} onChange={e => setInput(e.target.value)} rows={3} placeholder="Type text to hash…" /></Label>
            <Btn onClick={gen}>Generate Hash</Btn>
            <div className="result" style={{ fontSize: '0.77rem', wordBreak: 'break-all' }}>{result || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Hash will appear here…</span>}</div>
        </div>
    )
}

function RegexTester() {
    const [pattern, setPattern] = useState(''); const [flags, setFlags] = useState('gi'); const [text, setText] = useState(''); const [result, setResult] = useState('')
    const test = () => {
        try {
            const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
            setResult(matches.length ? `✅ ${matches.length} match(es):\n${matches.map(m => `"${m[0]}" at index ${m.index}`).join('\n')}` : '❌ No matches found')
        } catch { setResult('❌ Invalid regex pattern') }
    }
    return (
        <div className="toolUi">
            <Row>
                <Label text="Pattern"><input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="\\b\\w+@\\w+\\.\\w+\\b" /></Label>
                <Label text="Flags"><input value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" style={{ fontFamily: 'monospace' }} /></Label>
            </Row>
            <Label text="Test String"><textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Paste test string here…" /></Label>
            <Btn onClick={test}>Test</Btn>
            <Result value={result} />
        </div>
    )
}

function Stopwatch() {
    const [time, setTime] = useState(0); const [running, setRunning] = useState(false); const [laps, setLaps] = useState<string[]>([])
    const ivRef = useRef<ReturnType<typeof setInterval> | null>(null); const startRef = useRef(0); const offsetRef = useRef(0)
    const fmt = (ms: number) => { const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), cs = Math.floor((ms % 1000) / 10); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}` }
    const toggle = () => { if (running) { if (ivRef.current) clearInterval(ivRef.current); offsetRef.current += Date.now() - startRef.current; setRunning(false) } else { startRef.current = Date.now(); ivRef.current = setInterval(() => setTime(offsetRef.current + Date.now() - startRef.current), 50); setRunning(true) } }
    const lap = () => { if (running) setLaps(l => [`Lap ${l.length + 1}: ${fmt(offsetRef.current + Date.now() - startRef.current)}`, ...l]) }
    const reset = () => { if (ivRef.current) clearInterval(ivRef.current); setRunning(false); setTime(0); offsetRef.current = 0; setLaps([]) }
    useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current) }, [])
    return (
        <div className="toolUi" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', color: 'var(--teal)', letterSpacing: 4, fontWeight: 700, padding: '10px 0' }}>{fmt(time)}</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="toolBtn" onClick={toggle} style={{ width: 'auto', padding: '9px 20px' }}>{running ? 'Stop' : 'Start'}</button>
                <button className="toolBtn secondary" onClick={lap} style={{ width: 'auto', padding: '9px 20px' }}>Lap</button>
                <button className="toolBtn secondary" onClick={reset} style={{ width: 'auto', padding: '9px 20px' }}>Reset</button>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-sec)', textAlign: 'left', width: '100%', maxHeight: 140, overflowY: 'auto' }}>{laps.map((l, i) => <div key={i}>{l}</div>)}</div>
        </div>
    )
}

function Coin() {
    const [result, setResult] = useState(''); const [heads, setHeads] = useState(0); const [tails, setTails] = useState(0); const [coin, setCoin] = useState('🪙')
    const flip = () => { const h = Math.random() < 0.5; setCoin(h ? '🌟' : '🌑'); setTimeout(() => setCoin('🪙'), 600); if (h) { setHeads(c => c + 1); setResult('⭐ HEADS!') } else { setTails(c => c + 1); setResult('🌑 TAILS!') } }
    return (
        <div className="toolUi" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', lineHeight: 1, margin: '10px 0', transition: 'transform 0.3s' }}>{coin}</div>
            <Btn onClick={flip}>Flip Coin</Btn>
            <div className="result" style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', textAlign: 'center' }}>{result || '—'}</div>
            {(heads + tails) > 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Heads: {heads} · Tails: {tails} ({heads + tails} flips)</div>}
        </div>
    )
}

function Dice() {
    const [count, setCount] = useState(2); const [sides, setSides] = useState(6); const [result, setResult] = useState('')
    const roll = () => { const rolls = Array.from({ length: Math.min(count, 20) }, () => Math.ceil(Math.random() * sides)); setResult(`Rolls: ${rolls.join(', ')}\nTotal: ${rolls.reduce((a, b) => a + b, 0)}`) }
    return (
        <div className="toolUi" style={{ textAlign: 'center' }}>
            <Row>
                <Label text="Number of Dice"><input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} min={1} max={20} /></Label>
                <Label text="Sides per Die"><input type="number" value={sides} onChange={e => setSides(parseInt(e.target.value) || 6)} min={2} max={100} /></Label>
            </Row>
            <Btn onClick={roll}>Roll Dice 🎲</Btn>
            <Result value={result} empty="Roll to see results…" />
        </div>
    )
}

function Tip() {
    const [bill, setBill] = useState(''); const [pct, setPct] = useState(15); const [split, setSplit] = useState(2); const [result, setResult] = useState('')
    const calc = () => { const b = parseFloat(bill); if (isNaN(b)) { setResult('Enter a valid bill amount'); return }; const tip = b * pct / 100, total = b + tip; setResult(`Tip: $${tip.toFixed(2)}\nTotal: $${total.toFixed(2)}\nPer Person: $${(total / split).toFixed(2)}`) }
    return (
        <div className="toolUi">
            <Label text="Bill Amount ($)"><input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="50.00" step="0.01" /></Label>
            <Row>
                <Label text="Tip %"><input type="number" value={pct} onChange={e => setPct(parseInt(e.target.value) || 0)} min={0} max={100} /></Label>
                <Label text="Split Among"><input type="number" value={split} onChange={e => setSplit(parseInt(e.target.value) || 1)} min={1} /></Label>
            </Row>
            <Btn onClick={calc}>Calculate</Btn>
            <Result value={result} empty="Results will appear here…" />
        </div>
    )
}

function ReadTime() {
    const [text, setText] = useState(''); const [wpm, setWpm] = useState(238); const [result, setResult] = useState('')
    const calc = () => { const words = text.trim().split(/\s+/).filter(Boolean).length; const mins = words / wpm; const m = Math.floor(mins), s = Math.round((mins - m) * 60); setResult(`${words.toLocaleString()} words\n~${m}m ${s}s at ${wpm} WPM`) }
    return (
        <div className="toolUi">
            <Label text="Paste Article / Text"><textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Paste text here…" /></Label>
            <Label text="Reading Speed (WPM)"><input type="number" value={wpm} onChange={e => setWpm(parseInt(e.target.value) || 238)} min={50} max={1000} /></Label>
            <Btn onClick={calc}>Estimate</Btn>
            <Result value={result} empty="Estimate will appear here…" />
        </div>
    )
}

function Markdown() {
    const [md, setMd] = useState('## Hello, World!\n\nType **Markdown** and click Preview.'); const [html, setHtml] = useState('')
    const preview = () => { setHtml(md.replace(/^### (.+)/gm, '<h3>$1</h3>').replace(/^## (.+)/gm, '<h2>$1</h2>').replace(/^# (.+)/gm, '<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>').replace(/\n/g, '<br>')) }
    return (
        <div className="toolUi">
            <Label text="Markdown Input"><textarea value={md} onChange={e => setMd(e.target.value)} rows={6} /></Label>
            <Btn onClick={preview}>Preview</Btn>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 10, padding: '14px 16px', fontSize: '0.87rem', color: 'var(--text-primary)', minHeight: 80, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: html || '<span style="color:var(--text-muted);font-style:italic">Preview will appear here…</span>' }} />
        </div>
    )
}

/* ─── Registry ───────────────────────────────────────── */
const TOOL_MAP: Record<string, FC> = {
    calculator: Calculator, percentage: Percentage, bmi: BMI, prime: Prime,
    fibonacci: Fibonacci, loan: Loan,
    unit: UnitConverter, currency: Currency, base: NumberBase, roman: Roman, colorconv: ColorConv,
    wordcount: WordCount, caseconv: CaseConv, lorem: Lorem, palindrome: Palindrome,
    palette: Palette, contrast: Contrast, gradient: Gradient,
    htmlenc: HtmlEnc, urlenc: UrlEnc, base64: Base64Tool, json: JsonFmt,
    unix: Unix, age: Age, countdown: Countdown,
    password: Password, uuid: UUID, hash: Hash, regex: RegexTester,
    stopwatch: Stopwatch, coin: Coin, dice: Dice, tip: Tip,
    readtime: ReadTime, markdown: Markdown,
}

interface ToolUIProps { toolId: string }

export default function ToolUI({ toolId }: ToolUIProps) {
    const Component = TOOL_MAP[toolId]
    if (!Component) return <p style={{ color: 'var(--text-muted)' }}>Tool UI coming soon.</p>
    return <Component />
}
