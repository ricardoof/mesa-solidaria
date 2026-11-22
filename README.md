# Mesa Solidária: protótipo navegável (Projeto de IHC)

Protótipo único e completo do sistema de doação de alimentos, que reúne todos os cenários
das Etapas 2.2 (diagramas MoLIC) e 2.3 (esboços de baixa fidelidade).

Equipe: Ellen Torres Rocha, Joao Vitor de Melo Machado, Raianny Letícia Ferreira de Amorim
e Ricardo de Oliveira Ferreira.

## Como rodar no VS Code

1. Instale o [Node.js](https://nodejs.org) (versão 18 ou mais nova).
2. Abra esta pasta no VS Code (Arquivo > Abrir pasta).
3. No terminal (Ctrl + `), rode:

```bash
npm install
npm run dev
```

4. Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Como publicar na Vercel

1. Suba a pasta para um repositório no GitHub.
2. Em vercel.com, use "Add New > Project" e importe o repositório.
3. A Vercel detecta o Vite sozinha (build `npm run build`, saída `dist`). Clique em Deploy.

Não há backend, banco de dados nem rotas de URL, então recarregar a página nunca dá erro 404.

## Contas de teste

| Perfil | Login | Senha |
| --- | --- | --- |
| Habitante | julia@exemplo.com | 123456 |
| Estabelecimento | 12.345.678/0001-90 (ou contato@bompreco.com) | 123456 |

A tela de login também tem o botão "Entrar com 1 clique". Novos cadastros (de habitante ou de
estabelecimento) funcionam durante a sessão. Todos os dados ficam só na memória do navegador.

## Telas do protótipo

Cada tela existe uma única vez e é compartilhada entre os perfis:

| Tela | Cenários que atende |
| --- | --- |
| Início | Tela inicial de todos os cenários: doar, instruções, status do banco e categorias aceitas, endereço, horários e mapa, atalhos da loja, pontos e lista de doações |
| Entrar / Criar cadastro | Login e cadastro de habitante (Hab. 1 e 3) e de estabelecimento (Estab. 1) |
| Como doar | Instruções (Hab. 2) e diretrizes de doação e conservação (Hab. 4) |
| Nova doação | Abrir processo de doação (Hab. 1 e 2), solicitação de itens (Hab. 3, Estab. 3 e 4), cadastro de alimentos com validação (Hab. 4) e reserva de capacidade (Estab. 2, interação 1) |
| Agendamento da retirada | Hab. 3 e retirada no fechamento da loja (Estab. 4) |
| Doação registrada | Comprovante de agendamento (Hab. 3), instruções de entrega (Hab. 4, Estab. 2), código do lote (Estab. 1) e passe expresso (Estab. 2, interação 2) |
| Acompanhamento da doação | Hab. 1, Estab. 3 e 4 |
| Entrega da doação | Preparação, entrega e confirmação com liberação de pontos (Estab. 3 e 4) |
| Doação rápida em lote | Estab. 1 |
| Doação urgente | Estab. 2, interação 2 |

## Alternativas de design escolhidas

- **Hab. 2 (instruções):** MoLIC 2, com o botão de iniciar doação também na tela de instruções, porque reduz passos.
- **Hab. 3 (agendamento):** lista de horários, com menos toques e foco no que está disponível.
- **Hab. 4 (diretrizes):** painel dentro do próprio formulário, para não trocar de tela nem perder o que já foi digitado. As diretrizes completas também ficam na tela Como doar.
- **Estab. 1 (lote):** interação 1, pelo smartphone, que é a mais rápida para quem não tem tempo.
- **Estab. 2, interação 2 (urgência):** cartões de categoria e controle deslizante, com menos digitação numa emergência.

A interação 1 do Estab. 2 (validação imediata) não é uma alternativa da interação 2, e sim uma
função complementar. Por isso ela foi incorporada: o status do banco aparece no início e a
capacidade é validada e reservada ao enviar a doação.

## Situações de erro que dá para testar

- Escolher Enlatados (estoque cheio hoje) ou Comida caseira pronta (não aceita).
- Informar validade vencida ou laticínios com menos de 3 dias de validade.
- Doar mais quilos do que o banco ainda recebe no dia.
- Escolher o primeiro horário de retirada da lista (outra pessoa o reserva no mesmo instante).
- Consultar o andamento logo após doar (fica em análise na primeira consulta).
- Informar a entrega antes da equipe confirmar (a primeira tentativa pede para aguardar).
- Doação urgente com urgência baixa ou moderada (não qualifica para envio expresso).

## Estrutura

```
src/
  App.jsx          cabeçalho com a equipe e o nome do app, celular e troca de telas
  estado.jsx       estado central: navegação, login, doações, capacidade do banco
  dados.js         dados fictícios (banco, usuários, categorias, horários)
  validacoes.js    regras que geram as mensagens de erro
  componentes/     interface, componentes comuns, moldura do celular, ilustrações
  telas/           uma tela por arquivo
```
