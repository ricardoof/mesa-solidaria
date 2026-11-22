import { CATEGORIAS } from './dados.js'

export function validarItens(itens, prefixo = 'Erro na listagem dos itens') {
  const preenchidos = itens.filter((i) => i.item || i.qtd)
  if (!preenchidos.length) return `${prefixo}: adicione pelo menos um item com quantidade.`
  if (preenchidos.find((i) => !i.item || !(Number(i.qtd) > 0)))
    return `${prefixo}: escolha o item e informe uma quantidade maior que zero em todas as linhas.`
  const nomes = preenchidos.map((i) => i.item)
  const repetido = nomes.find((n, idx) => nomes.indexOf(n) !== idx)
  if (repetido) return `${prefixo}: ${repetido} aparece duas vezes. Junte as quantidades em uma linha só.`
  return null
}

export const somaKg = (itens) => itens.reduce((s, i) => s + (Number(i.qtd) || 0), 0)

export function validarDoacao(d, livreKg) {
  if (!d.categoria) return 'Dados incompletos: escolha a categoria dos alimentos.'
  const cat = CATEGORIAS.find((c) => c.nome === d.categoria)
  if (cat.status === 'nao-aceita')
    return `Dados inválidos: ${d.categoria.toLowerCase()} não é aceito pelo banco. Veja as diretrizes logo abaixo.`
  if (cat.status === 'pausada')
    return `Categoria não aceita hoje: o estoque de ${d.categoria.toLowerCase()} está cheio. Escolha outra categoria ou doe a partir de amanhã.`
  const erroItens = validarItens(d.itens)
  if (erroItens) return erroItens
  if (!cat.semValidade) {
    if (!d.validade) return 'Dados incompletos: informe a data de validade.'
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const validade = new Date(`${d.validade}T00:00:00`)
    if (validade < hoje) return 'Dados inválidos: a data de validade já passou.'
    if (d.categoria === 'Laticínios' && Math.round((validade - hoje) / 86400000) < 3)
      return 'Dados inválidos: laticínios precisam de pelo menos 3 dias de validade.'
  }
  if (!d.modalidade) return 'Dados incompletos: escolha se você leva até o banco ou se prefere a retirada.'
  const total = somaKg(d.itens)
  if (total > livreKg)
    return `Volume acima da capacidade disponível: o banco recebe só mais ${livreKg} kg hoje. Reduza a quantidade ou divida em duas doações.`
  return null
}

export function validarCadastro(d, usuarios) {
  const loja = d.perfil === 'estabelecimento'
  const faltando = []
  if (!d.nome?.trim()) faltando.push(loja ? 'nome do estabelecimento' : 'nome')
  if (loja && !d.cnpj?.trim()) faltando.push('CNPJ')
  if (!d.email?.trim()) faltando.push('e-mail')
  if (!d.telefone?.trim()) faltando.push('telefone')
  if (!d.endereco?.trim()) faltando.push('endereço')
  if (!d.senha) faltando.push('senha')
  if (faltando.length) return `Erro no cadastro: preencha ${faltando.join(', ')}.`
  if (!/^\S+@\S+\.\S+$/.test(d.email)) return 'Erro no cadastro: o e-mail precisa ter o formato nome@dominio.com.'
  if (loja && d.cnpj.replace(/\D/g, '').length !== 14) return 'Erro no cadastro: o CNPJ precisa ter 14 números.'
  if (d.senha.length < 6) return 'Erro no cadastro: a senha precisa ter pelo menos 6 caracteres.'
  if (usuarios.some((u) => u.email.toLowerCase() === d.email.trim().toLowerCase()))
    return 'Erro no cadastro: este e-mail já está em uso. Faça login ou use outro e-mail.'
  return null
}
