// Dados fictícios usados pelo protótipo. Nada é enviado para servidor.

export const BANCO = {
  nome: 'Banco de Alimentos Mesa Solidária',
  endereco: 'Rua das Mangueiras, 240, Centro',
  horarios: 'Segunda a sexta, das 8h às 17h. Sábado, das 8h às 12h.',
  horarioCurto: 'Seg a sex, 8h às 17h',
  telefone: '(31) 3333-0240',
  instituicoes: 14,
  capacidadeKg: 300,
  triagem: 'Marta Silva, (31) 98765-4321',
}

export const SELO_PONTOS = 400

export const USUARIOS_INICIAIS = [
  {
    id: 'u-julia',
    perfil: 'habitante',
    nome: 'Júlia Andrade',
    email: 'julia@exemplo.com',
    telefone: '(31) 98888-1234',
    endereco: 'Rua dos Ipês, 88, Santa Tereza',
    senha: '123456',
    pontos: 30,
  },
  {
    id: 'u-loja',
    perfil: 'estabelecimento',
    nome: 'Supermercado Bom Preço',
    cnpj: '12.345.678/0001-90',
    email: 'contato@bompreco.com',
    telefone: '(31) 3222-1500',
    endereco: 'Av. Brasil, 1500, Funcionários',
    senha: '123456',
    pontos: 350,
  },
]

const semanaPassada = new Date(Date.now() - 7 * 86400000)

export const DOACOES_INICIAIS = [
  {
    id: 'd-antiga',
    protocolo: 'DOA-KMR418',
    dono: 'u-loja',
    tipo: 'comum',
    categoria: 'Pães e massas',
    itens: [{ item: 'Pão de forma', qtd: 12 }],
    totalKg: 12,
    modalidade: 'entrega',
    etapa: 3,
    pontosLiberados: 50,
    criadaEm: semanaPassada,
    avisosEntrega: 1,
  },
]

// status: aceita | pausada (estoque cheio hoje) | nao-aceita (nunca aceita)
export const CATEGORIAS = [
  { nome: 'Hortifrúti', status: 'aceita', semValidade: true, perecivel: true,
    itens: ['Abóbora', 'Alface', 'Banana', 'Batata', 'Cenoura', 'Couve', 'Laranja', 'Maçã', 'Mamão', 'Manga', 'Tomate'] },
  { nome: 'Grãos e cereais', status: 'aceita', itens: ['Arroz', 'Feijão', 'Lentilha', 'Aveia', 'Fubá'] },
  { nome: 'Laticínios', status: 'aceita', perecivel: true, itens: ['Leite', 'Iogurte', 'Queijo', 'Requeijão'] },
  { nome: 'Pães e massas', status: 'aceita', perecivel: true, itens: ['Pão francês', 'Pão de forma', 'Macarrão', 'Bolo'] },
  { nome: 'Enlatados', status: 'pausada', itens: ['Milho em lata', 'Ervilha', 'Sardinha', 'Extrato de tomate'] },
  { nome: 'Comida caseira pronta', status: 'nao-aceita', itens: ['Marmita', 'Sopa'] },
  { nome: 'Bebidas alcoólicas', status: 'nao-aceita', itens: ['Cerveja', 'Vinho'] },
]

export const ETAPAS = ['Registrada', 'Em análise', 'Aprovada', 'Entregue']

export const INSTRUCOES = [
  { titulo: 'Veja o que pode ser doado', texto: 'Confira abaixo os alimentos aceitos e as categorias abertas hoje no início do app.' },
  { titulo: 'Entre ou crie sua conta', texto: 'Habitantes usam e-mail. Supermercados, feiras e restaurantes entram com o CNPJ.' },
  { titulo: 'Registre a doação', texto: 'Escolha a categoria e liste os itens. Lojas sem tempo podem mandar só uma foto das caixas.' },
  { titulo: 'Entregue ou peça a retirada', texto: 'Leve até o banco ou agende um horário para um voluntário buscar no seu endereço.' },
  { titulo: 'Acompanhe e ganhe pontos', texto: 'O app mostra cada etapa. Quando a equipe confirma o recebimento, seus pontos são liberados.' },
]

export const DIRETRIZES = {
  aceitos: [
    'Frutas, verduras e legumes frescos, sem partes estragadas',
    'Grãos, cereais e massas em embalagem fechada',
    'Laticínios refrigerados, com pelo menos 3 dias de validade',
    'Pães do dia',
  ],
  naoAceitos: [
    'Comida caseira pronta ou sobras de refeição',
    'Produtos vencidos ou com embalagem violada',
    'Bebidas alcoólicas',
    'Alimentos que foram descongelados',
  ],
  conservacao: [
    'Transporte frutas e verduras em caixas ventiladas, sem empilhar demais',
    'Mantenha laticínios refrigerados até a entrega',
    'Separe os itens mais maduros: eles são distribuídos primeiro',
  ],
}

// Horários de retirada nos próximos dias úteis.
// "lotado" não aparece; "disputado" parece livre, mas é reservado por outra
// pessoa no momento da confirmação (gera o erro "Horário indisponível").
export function gerarHorarios() {
  const horas = ['08:30', '10:00', '14:00', '16:30']
  const lista = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  let dias = 0
  while (dias < 12) {
    d.setDate(d.getDate() + 1)
    const semana = d.getDay()
    if (semana === 0) continue
    dias += 1
    horas.forEach((hora, i) => {
      if (semana === 6 && i > 1) return
      const n = (dias * 7 + i * 3) % 5
      let status = 'livre'
      if (dias === 1 && i === 0) status = 'disputado'
      else if (n === 0) status = 'lotado'
      lista.push({ id: `${d.toISOString().slice(0, 10)}-${hora}`, data: new Date(d), hora, status })
    })
  }
  return lista
}

export function gerarCodigo(prefixo) {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let s = ''
  for (let i = 0; i < 3; i++) s += letras[Math.floor(Math.random() * letras.length)]
  return `${prefixo}-${s}${Math.floor(100 + Math.random() * 900)}`
}

export const fmtDia = (d) => d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
export const fmtDiaLongo = (d) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
export const fmtData = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
export const fmtHora = (d) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function descreverItens(d) {
  if (d.tipo === 'lote') return 'Lote em caixas, a conferir pela equipe'
  if (!d.itens?.length) return d.totalKg ? `${d.totalKg} kg` : 'A informar'
  return d.itens.map((i) => `${i.qtd} kg de ${i.item}`).join(', ')
}

export const ROTULO_TIPO = {
  comum: 'Doação',
  lote: 'Doação rápida em lote',
  critica: 'Doação urgente',
}

export const ROTULO_MODALIDADE = {
  entrega: 'Entrega no banco',
  retirada: 'Retirada por voluntário',
}
