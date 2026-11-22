import { useState } from 'react'
import { useApp } from '../estado.jsx'
import { validarCadastro } from '../validacoes.js'
import { Botao, Campo, Segmentado, Tela } from '../componentes/ui.jsx'
import { PERFIS } from './Login.jsx'

const VAZIO = { nome: '', cnpj: '', email: '', telefone: '', endereco: '', senha: '' }

const EXEMPLOS = {
  habitante: { nome: 'Roberto Lima', email: 'roberto@exemplo.com', telefone: '(31) 97777-4321', endereco: 'Rua das Acácias, 15, Floresta', senha: '123456', cnpj: '' },
  estabelecimento: { nome: 'Feira Verde Hortifrúti', cnpj: '98.765.432/0001-10', email: 'contato@feiraverde.com', telefone: '(31) 3444-9090', endereco: 'Rua da Bahia, 900, Centro', senha: '123456' },
}

export default function Cadastro({ perfil: perfilInicial = 'habitante', destino }) {
  const app = useApp()
  const [perfil, setPerfil] = useState(perfilInicial)
  const [d, setD] = useState(VAZIO)
  const loja = perfil === 'estabelecimento'
  const mudar = (campo) => (e) => setD({ ...d, [campo]: e.target.value })

  async function enviar() {
    const dados = { ...d, perfil, email: d.email.trim() }
    const ok = await app.processo(() => validarCadastro(dados, app.usuarios))
    if (ok) {
      const novo = app.cadastrar(dados)
      app.entrar(novo, destino, 'Cadastro concluído com sucesso.')
    }
  }

  return (
    <Tela titulo="Criar cadastro" subtitulo="Leva menos de um minuto." rodape={<Botao onClick={enviar}>Enviar cadastro</Botao>}>
      <Segmentado rotulo="Tipo de conta" opcoes={PERFIS} valor={perfil} onChange={(p) => { setPerfil(p); setD(VAZIO); app.setErro(null) }} />
      <button type="button" onClick={() => setD(EXEMPLOS[perfil])} className="text-sm font-bold text-folha underline underline-offset-4">
        Preencher com dados de teste
      </button>
      <Campo rotulo={loja ? 'Nome do estabelecimento' : 'Nome'} autoComplete={loja ? 'organization' : 'name'} value={d.nome} onChange={mudar('nome')} />
      {loja && <Campo rotulo="CNPJ" inputMode="numeric" placeholder="00.000.000/0000-00" value={d.cnpj} onChange={mudar('cnpj')} />}
      <Campo rotulo="E-mail" type="email" autoComplete="email" value={d.email} onChange={mudar('email')} />
      <Campo rotulo="Telefone" type="tel" autoComplete="tel" value={d.telefone} onChange={mudar('telefone')} />
      <Campo
        rotulo={loja ? 'Endereço da loja' : 'Endereço'}
        autoComplete="street-address"
        value={d.endereco}
        onChange={mudar('endereco')}
        dica="Usado quando você pede a retirada da doação."
      />
      <Campo rotulo="Senha" type="password" autoComplete="new-password" value={d.senha} onChange={mudar('senha')} dica="Mínimo de 6 caracteres." />
    </Tela>
  )
}
