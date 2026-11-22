// Dados fictícios usados pelo protótipo. Nada é enviado para servidor.

export const BANCO = {
  nome: 'Banco de Alimentos Mesa Solidária',
  endereco: 'Rua das Mangueiras, 240, Centro',
  horarios: 'Segunda a sexta, das 8h às 17h. Sábado, das 8h às 12h.',
  telefone: '(31) 3333-0240',
  instituicoes: 14,
}

export const USUARIO_TESTE = {
  nome: 'Júlia Andrade',
  email: 'julia@exemplo.com',
  telefone: '(31) 98888-1234',
  senha: '123456',
  endereco: 'Rua dos Ipês, 88, Santa Tereza',
}

export const LOJA_TESTE = {
  nome: 'Supermercado Bom Preço',
  usuario: '12.345.678/0001-90',
  senha: '123456',
}

export const TIPOS_ALIMENTO = [
  'Frutas',
  'Verduras e legumes',
  'Grãos e cereais',
  'Laticínios',
  'Enlatados',
  'Pães e massas',
]

export const TIPOS_NAO_ACEITOS = ['Comida caseira pronta', 'Bebidas alcoólicas']

export const HORTIFRUTI = [
  'Abóbora', 'Alface', 'Banana', 'Batata', 'Cenoura', 'Couve',
  'Laranja', 'Maçã', 'Mamão', 'Manga', 'Tomate',
]

export const PRODUTOS_LOJA = [
  'Arroz 5 kg', 'Feijão 1 kg', 'Macarrão 500 g', 'Leite UHT 1 L', 'Iogurte',
  'Pão de forma', 'Banana (kg)', 'Tomate (kg)', 'Batata (kg)', 'Óleo 900 ml',
]

export const INSTRUCOES = [
  {
    titulo: 'Veja o que pode ser doado',
    texto: 'Alimentos dentro da validade e em embalagem fechada, ou frutas e verduras frescas. Comida caseira pronta não é aceita.',
  },
  {
    titulo: 'Abra a doação pelo app',
    texto: 'Informe o tipo de alimento e a quantidade aproximada. Não precisa ser exato.',
  },
  {
    titulo: 'Escolha retirada ou entrega',
    texto: 'Leve até o banco de alimentos ou peça para um voluntário buscar no seu endereço.',
  },
  {
    titulo: 'Acompanhe até a entrega',
    texto: 'O app mostra cada etapa e avisa quando sua doação chegar a uma família ou instituição.',
  },
]

export const DIRETRIZES = {
  aceitos: [
    'Frutas, verduras e legumes frescos, sem partes estragadas',
    'Grãos, cereais e massas em embalagem fechada',
    'Enlatados sem amassados ou ferrugem',
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

// Gera horários de agendamento para os próximos dias úteis.
// "lotado" aparece indisponível; "disputado" parece livre, mas é reservado
// por outra pessoa no momento do envio (demonstra a ruptura "Horário indisponível").
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
      lista.push({
        id: `${d.toISOString().slice(0, 10)}-${hora}`,
        data: new Date(d),
        hora,
        status,
      })
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

export const fmtDia = (d) =>
  d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })

export const fmtDiaLongo = (d) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

export const fmtHora = (d) =>
  d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
