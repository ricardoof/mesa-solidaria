// Ilustrações em SVG feitas para o protótipo (sem imagens externas).

export function Marca({ claro = false, tamanho = 28 }) {
  const cor = claro ? '#FFFFFF' : '#1E5A3C'
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden>
        <path d="M4 18h24a12 12 0 0 1-24 0z" fill="#F2B53A" />
        <path d="M16 17V8" stroke={cor} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 11c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5z" fill={cor} />
        <path d="M16 13.5c0-3.3-2.2-5.5-5.5-5.5 0 3.3 2.2 5.5 5.5 5.5z" fill={cor} />
      </svg>
      <span className={`font-display font-extrabold tracking-tight ${claro ? 'text-white' : 'text-folha'}`} style={{ fontSize: tamanho * 0.68 }}>
        Mesa Solidária
      </span>
    </span>
  )
}

export function Mapa({ rotulo = 'Mesa Solidária' }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-stone-200">
      <svg viewBox="0 0 320 160" className="block h-auto w-full" role="img" aria-label={`Mapa com a localização de ${rotulo}`}>
        <rect width="320" height="160" fill="#E8EDE3" />
        <rect x="18" y="14" width="80" height="48" rx="4" fill="#D6DFCF" />
        <rect x="118" y="14" width="70" height="48" rx="4" fill="#D6DFCF" />
        <rect x="208" y="14" width="96" height="48" rx="4" fill="#CFE0C3" />
        <rect x="18" y="92" width="80" height="54" rx="4" fill="#D6DFCF" />
        <rect x="118" y="92" width="70" height="54" rx="4" fill="#D6DFCF" />
        <rect x="208" y="92" width="96" height="54" rx="4" fill="#D6DFCF" />
        <path d="M0 77h320M108 0v160M198 0v160" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M0 77h320" stroke="#F2B53A" strokeWidth="2" strokeDasharray="8 8" />
        <circle cx="236" cy="40" r="7" fill="#9CC48A" />
        <circle cx="270" cy="34" r="9" fill="#9CC48A" />
        <g transform="translate(153 40)">
          <path d="M0 26C-10 12-12 6-12 0a12 12 0 0 1 24 0c0 6-2 12-12 26z" fill="#B83A24" />
          <circle cx="0" cy="0" r="4.5" fill="#fff" />
        </g>
      </svg>
      <figcaption className="sr-only">{rotulo}</figcaption>
    </figure>
  )
}

const CAIXAS_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 260'>
<rect width='400' height='260' fill='#D9D3C7'/><rect y='196' width='400' height='64' fill='#B7AD9C'/>
${[30, 150, 270]
  .map((x, i) => {
    const cores = [['#F08A24', '#F5A13D'], ['#D2412B', '#E0553E'], ['#5A9A3A', '#78B455']][i]
    const frutas = Array.from({ length: 6 }, (_, k) => `<circle cx='${x + 14 + k * 17}' cy='${118 + (k % 2) * 6}' r='13' fill='${cores[k % 2]}'/>`).join('')
    return `${frutas}<rect x='${x}' y='122' width='110' height='80' rx='4' fill='#B07A45'/>
<rect x='${x}' y='140' width='110' height='6' fill='#8A5A33'/><rect x='${x}' y='166' width='110' height='6' fill='#8A5A33'/>
<rect x='${x + 40}' y='128' width='30' height='8' rx='4' fill='#7A4E2A'/>`
  })
  .join('')}
</svg>`

export const FOTO_EXEMPLO = `data:image/svg+xml;utf8,${encodeURIComponent(CAIXAS_SVG)}`

// QR code ilustrativo (não é decodificável): padrão gerado a partir do código.
export function QrIlustrativo({ codigo, tamanho = 168 }) {
  const n = 25
  let semente = [...codigo].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const aleatorio = () => {
    semente = (semente * 1664525 + 1013904223) >>> 0
    return semente / 4294967296
  }
  const emFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
  const celulas = []
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!emFinder(x, y) && aleatorio() > 0.52) celulas.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  const finder = (x, y) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  )
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={tamanho} height={tamanho} role="img" aria-label={`QR code do passe ${codigo}`} shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#1A231E">
        {celulas}
        {finder(0, 0)}
        {finder(n - 7, 0)}
        {finder(0, n - 7)}
      </g>
    </svg>
  )
}

export function CestaIlustracao() {
  return (
    <svg viewBox="0 0 220 120" className="mx-auto block h-28 w-auto" aria-hidden>
      <circle cx="70" cy="52" r="20" fill="#F08A24" />
      <circle cx="104" cy="40" r="22" fill="#D2412B" />
      <path d="M134 60c-4-30 10-44 30-46-2 22-12 38-30 46z" fill="#5A9A3A" />
      <circle cx="146" cy="58" r="16" fill="#F2B53A" />
      <path d="M30 62h160l-16 52H46z" fill="#B07A45" />
      <path d="M38 78h144M42 94h136" stroke="#8A5A33" strokeWidth="5" />
    </svg>
  )
}
