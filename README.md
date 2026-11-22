# Mesa Solidária: protótipo navegável (Projeto de IHC)

Protótipo de alta fidelidade do sistema de doação de alimentos, feito a partir dos
diagramas MoLIC (Etapa 2.2) e dos esboços de baixa fidelidade (Etapa 2.3).

Equipe: Ellen Torres Rocha, Joao Vitor de Melo Machado, Raianny Letícia Ferreira de Amorim
e Ricardo de Oliveira Ferreira.

## Como rodar no VS Code

1. Instale o [Node.js](https://nodejs.org) (versão 18 ou mais nova).
2. Abra esta pasta no VS Code (Arquivo > Abrir pasta).
3. Abra o terminal (Ctrl + `) e rode:

```bash
npm install
npm run dev
```

4. Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Como publicar na Vercel (link para os avaliadores)

1. Suba esta pasta para um repositório no GitHub.
2. Em vercel.com, clique em "Add New > Project" e importe o repositório.
3. A Vercel detecta o Vite sozinha (build: `npm run build`, saída: `dist`). Clique em Deploy.

Também funciona na Netlify com as mesmas configurações. Não há backend, banco de dados
nem rotas de URL, então não existe risco de erro 404 ao recarregar a página.

## O que tem no protótipo

- **8 cenários**: 4 de Habitantes e 4 de Estabelecimentos, cada um seguindo seu diagrama MoLIC.
- **Alternativas de design** dos esboços, trocadas por um seletor (MoLIC 1 e 2, calendário e
  lista, tela própria e painel, smartphone e desktop, formulário e cartões).
- **Painel "Caminho no diagrama MoLIC"**: desenha em tempo real as cenas, processos e falas
  (u: e p:) percorridas, com as rupturas em linha pontilhada.
- **Interruptor "Usuário já autenticado"**: muda o caminho no processo "Autenticado ou não?".
- **Interruptor "Simular falhas do sistema"**: a primeira tentativa de cada processo falha,
  para demonstrar as recuperações de ruptura dos diagramas.
- Login com 1 clique (usuário teste) e botões para preencher dados de teste.

Todos os dados são fictícios e ficam só na memória do navegador.

## Estrutura

```
src/
  App.jsx                 painel do simulador (perfis, cenários, alternativas)
  fluxo.jsx               motor de navegação no formato MoLIC (cenas, processos, rupturas)
  simulador.jsx           estado global (autenticação, falhas, registro do caminho)
  dados.js                dados fictícios (banco, alimentos, horários)
  validacoes.js           regras que geram as mensagens de erro (p:)
  componentes/            UI, telas reutilizadas (↻ nos esboços), molduras, ilustrações
  cenarios/habitantes/    Cenario1.jsx a Cenario4.jsx
  cenarios/estabelecimentos/ Cenario1.jsx a Cenario4.jsx
```

Para mudar o nome do sistema, edite o componente `Marca` em `src/componentes/ilustracoes.jsx`
e os dados em `src/dados.js`.

## Interpretações feitas a partir dos documentos

- Habitantes, cenário 3: o agendamento foi tratado como coleta no endereço do doador (já que
  Roberto não consegue transportar), por isso o cadastro pede um endereço para coleta.
- Habitantes, cenário 1: os botões "Consultar andamento" avançam o status para demonstrar a
  linha do tempo, sem processo próprio (o diagrama termina nessa cena).
- Estabelecimentos, cenários 3 e 4: a primeira consulta de andamento retorna "em análise",
  e no cenário 4 a primeira confirmação de entrega retorna "recebimento ainda não confirmado",
  como nos laços de retorno dos diagramas.
