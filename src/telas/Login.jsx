import { useState } from 'react'
import { Store, UsersRound, Zap } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { USUARIOS_INICIAIS } from '../dados.js'
import { Botao, Campo, Segmentado, Tela } from '../componentes/ui.jsx'

export const PERFIS = [
  { valor: 'habitante', rotulo: 'Habitante', icone: UsersRound },
  { valor: 'estabelecimento', rotulo: 'Estabelecimento', icone: Store },
]

const soDigitos = (s) => s.replace(/\D/g, '')

export default function Login({ perfil: perfilInicial = 'habitante', destino }) {
  const app = useApp()
  const [perfil, setPerfil] = useState(perfilInicial)
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const loja = perfil === 'estabelecimento'
  const teste = USUARIOS_INICIAIS.find((u) => u.perfil === perfil)

  async function entrar(login, senhaInformada) {
    let encontrado = null
    const ok = await app.processo(() => {
      if (!login.trim() || !senhaInformada) return `Erro no login: preencha ${loja ? 'CNPJ ou e-mail' : 'e-mail'} e senha.`
      encontrado = app.usuarios.find(
        (u) =>
          u.perfil === perfil &&
          (u.email.toLowerCase() === login.trim().toLowerCase() || (u.cnpj && soDigitos(u.cnpj) === soDigitos(login) && soDigitos(login))) &&
          u.senha === senhaInformada,
      )
      if (!encontrado) return `Erro no login: ${loja ? 'CNPJ' : 'e-mail'} ou senha não conferem. Confira os dados ou crie um cadastro.`
      return null
    })
    if (ok) app.entrar(encontrado, destino)
  }

  return (
    <Tela
      titulo="Entrar"
      subtitulo={destino ? 'Entre para continuar sua doação.' : 'Acesse sua conta.'}
      rodape={
        <>
          <Botao onClick={() => entrar(usuario, senha)}>Entrar</Botao>
          <Botao variante="destaque" icone={Zap} onClick={() => entrar(loja ? teste.cnpj : teste.email, teste.senha)}>
            Entrar com 1 clique ({loja ? 'loja teste' : 'habitante teste'})
          </Botao>
          <Botao variante="fantasma" onClick={() => app.ir('cadastro', { perfil, destino }, { substituir: true })}>Não possuo cadastro</Botao>
        </>
      }
    >
      <Segmentado rotulo="Tipo de conta" opcoes={PERFIS} valor={perfil} onChange={(p) => { setPerfil(p); setUsuario(''); app.setErro(null) }} />
      <Campo
        rotulo={loja ? 'CNPJ ou e-mail' : 'E-mail'}
        type={loja ? 'text' : 'email'}
        autoComplete="username"
        placeholder={loja ? '00.000.000/0000-00' : 'nome@exemplo.com'}
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <Campo rotulo="Senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <p className="rounded-lg bg-stone-100 p-3 text-xs text-stone-600">
        Conta de teste: {loja ? teste.cnpj : teste.email}, senha {teste.senha}.
      </p>
    </Tela>
  )
}
