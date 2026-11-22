import Hab1 from './habitantes/Cenario1.jsx'
import Hab2 from './habitantes/Cenario2.jsx'
import Hab3 from './habitantes/Cenario3.jsx'
import Hab4 from './habitantes/Cenario4.jsx'
import Est1 from './estabelecimentos/Cenario1.jsx'
import Est2 from './estabelecimentos/Cenario2.jsx'
import Est3 from './estabelecimentos/Cenario3.jsx'
import Est4 from './estabelecimentos/Cenario4.jsx'

// Catálogo de cenários do trabalho (Etapas 2.2 e 2.3).
export const CENARIOS = [
  {
    id: 'hab-1',
    perfil: 'habitante',
    numero: 1,
    titulo: 'Júlia não sabe para quem doar',
    componente: Hab1,
    usaLogin: true,
  },
  {
    id: 'hab-2',
    perfil: 'habitante',
    numero: 2,
    titulo: 'Júlia não encontra orientação clara',
    componente: Hab2,
    variantes: [
      { id: 'A', rotulo: 'MoLIC 1', descricao: 'A tela de instruções é só informativa. Fica mais simples, mas Júlia precisa voltar à tela inicial para doar.' },
      { id: 'B', rotulo: 'MoLIC 2', descricao: 'A tela de instruções também tem o botão de iniciar doação. Júlia doa logo depois de ler, com menos passos.' },
    ],
  },
  {
    id: 'hab-3',
    perfil: 'habitante',
    numero: 3,
    titulo: 'Roberto não consegue transportar a doação',
    componente: Hab3,
    variantes: [
      { id: 'A', rotulo: 'Calendário', descricao: 'Mostra o mês inteiro e permite planejar com antecedência.' },
      { id: 'B', rotulo: 'Lista', descricao: 'Menos toques e deixa claro o que está disponível, mas mostra menos datas por vez.' },
    ],
  },
  {
    id: 'hab-4',
    perfil: 'habitante',
    numero: 4,
    titulo: 'Roberto não sabe se a destinatária aceita seus alimentos',
    componente: Hab4,
    variantes: [
      { id: 'A', rotulo: 'Tela própria', descricao: 'Segue o diagrama: diretrizes em uma cena separada, com mais espaço para o texto.' },
      { id: 'B', rotulo: 'Painel', descricao: 'Diretrizes dentro do próprio cadastro: não troca de tela, mas elimina uma cena do MoLIC.' },
    ],
  },
  {
    id: 'est-1',
    perfil: 'estabelecimento',
    numero: 1,
    titulo: 'Falta de tempo para separar os excedentes',
    componente: Est1,
    usaLogin: true,
    variantes: [
      { id: 'I1', rotulo: 'Smartphone', descricao: 'Interação 1: mais rápida, com login e câmera direto no celular.', dispositivo: 'celular' },
      { id: 'I2', rotulo: 'Desktop', descricao: 'Interação 2: permite delegar a um funcionário, com escolha do tipo e revisão da foto antes do envio.', dispositivo: 'desktop' },
    ],
  },
  {
    id: 'est-2',
    perfil: 'estabelecimento',
    numero: 2,
    titulo: 'Dificuldade para encontrar quem receba a doação',
    componente: Est2,
    variantes: [
      { id: 'I1', rotulo: 'Validação', descricao: 'Interação 1: o painel mostra capacidade e categorias aceitas, e o espaço é reservado antes da entrega.' },
      { id: 'I2A', rotulo: 'Urgência A', descricao: 'Interação 2, alternativa A: formulário com lista de seleção e botões de opção.' },
      { id: 'I2B', rotulo: 'Urgência B', descricao: 'Interação 2, alternativa B: cartões de categoria e controle deslizante, com menos digitação numa emergência.' },
    ],
  },
  {
    id: 'est-3',
    perfil: 'estabelecimento',
    numero: 3,
    titulo: 'Doação pontual que não se torna rotina',
    componente: Est3,
  },
  {
    id: 'est-4',
    perfil: 'estabelecimento',
    numero: 4,
    titulo: 'Fechamento do estabelecimento e retirada dos alimentos',
    componente: Est4,
  },
]
