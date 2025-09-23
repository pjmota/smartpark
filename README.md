# 🚗 Sistema de Gestão ESTAPAR

> **Sistema completo de gerenciamento de estacionamentos e planos de mensalistas digitais**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.1-0081CB?style=flat-square&logo=mui)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

O **Sistema ESTAPAR** é uma aplicação web moderna desenvolvida para gerenciar estacionamentos e planos de mensalistas digitais. Criado para atender às necessidades de administradores, oferecendo controle total sobre vagas, ocupação e planos em tempo real.

### 🎯 Principais Funcionalidades

- **📊 Dashboard Completo**: Visualização em tempo real de vagas totais, ocupadas e disponíveis
- **🏢 Gestão de Estacionamentos**: Informações detalhadas de cada unidade (nome, código, endereço, filial, regional)
- **📋 Gerenciamento de Planos**: CRUD completo para planos de mensalistas digitais
- **🚗 Controle por Tipo de Veículo**: Suporte para carros, motos e outros tipos
- **💰 Gestão Financeira**: Controle de valores mensais e diários/rotativos
- **📅 Períodos de Validade**: Definição de início e fim dos planos
- **🔄 Status Dinâmico**: Ativação/desativação de planos em tempo real
- **🔐 Sistema de Autenticação**: Login seguro com JWT tokens
- **📱 Interface Responsiva**: Design adaptável para desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Framework**: Next.js 15.4.6 com App Router
- **Linguagem**: TypeScript 5.0
- **UI Components**: Material-UI (MUI) 7.3.1
- **Estilização**: Tailwind CSS 4.0
- **Ícones**: Lucide React + Material-UI Icons
- **Notificações**: React Toastify

### **Gerenciamento de Estado**
- **Autenticação**: React Context API
- **HTTP Client**: Axios 1.11.0

### **Desenvolvimento**
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint 9
- **Tipagem**: TypeScript com strict mode

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── authenticatedPages/       # Páginas protegidas
│   │   └── garages/             # Gestão de estacionamentos
│   ├── login/                   # Página de login
│   ├── globals.css              # Estilos globais
│   └── layout.tsx               # Layout principal
├── components/                   # Componentes reutilizáveis
│   ├── cards/                   # Cards de informações
│   │   └── GarageCards/         # Cards específicos de garagens
│   ├── modals/                  # Modais e dialogs
│   │   └── GarageModals/        # Modais de garagem
│   ├── Sidebar/                 # Navegação lateral
│   └── providers/               # Providers de contexto
├── context/                     # Contextos React
│   └── AuthContext/             # Contexto de autenticação
├── services/                    # Serviços de API
│   ├── AuthService/             # Serviços de autenticação
│   ├── clientsService/          # Serviços de clientes
│   └── planServices/            # Serviços de planos
├── types/                       # Definições TypeScript
├── utils/                       # Utilitários
│   ├── formatCurrency.ts        # Formatação de moeda
│   └── modalUtils.ts            # Utilitários de acessibilidade
└── mock/                        # Dados de desenvolvimento
```

## 🚀 Como Executar o Projeto

### **Pré-requisitos**

- Node.js 20+ 
- npm ou yarn
- Git

### **Instalação**

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd teste_estapar
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie o arquivo .env.local na raiz do projeto
   NEXT_PUBLIC_API_URL=https://mock.apidog.com/m1/1022746-1009361-default
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3005
   ```

### **Scripts Disponíveis**

```bash
npm run dev        # Servidor de desenvolvimento (porta 3005)
npm run dev-teste  # Servidor de teste (porta 3006)
npm run build      # Build para produção
npm run start      # Servidor de produção
npm run lint       # Verificação de código
```


## 🎨 Interface e Experiência

### **Design System**
- **Cores**: Paleta oficial ESTAPAR com verde primário (#7ad33e)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Material Design com customizações
- **Animações**: Transições suaves e micro-interações

### **Responsividade**
- 💻 Desktop otimizado

## 🔐 Autenticação e Segurança

- **JWT Tokens**: Autenticação segura
- **Interceptors**: Renovação automática de tokens
- **Proteção de Rotas**: Páginas protegidas por autenticação
- **LocalStorage**: Persistência segura de sessão

## 📊 Estado Atual

### **✅ Implementado**
- Sistema completo de autenticação
- Dashboard de estacionamentos
- CRUD de planos de mensalistas
- Interface responsiva
- Validações de formulário
- Sistema de notificações
- Acessibilidade em modais

### **🔄 Em Desenvolvimento**
- Integração com backend real
- Testes unitários
- Documentação de API
- Internacionalização

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

**Paulo José Mota**  
📧 Email: [paulob1@hotmail.com](mailto:paulob1@hotmail.com)

---

<div align="center">

**Desenvolvido com ❤️ para otimizar a gestão de estacionamentos**

*Sistema ESTAPAR - Transformando a experiência de gestão de vagas*

</div>