# 🚗 Sistema de Gestão SmartPark

> **Sistema completo de gerenciamento de estacionamentos e planos de mensalistas digitais**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.1-0081CB?style=flat-square&logo=mui)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

O **Sistema SmartPark** é uma aplicação web moderna desenvolvida para gerenciar estacionamentos e planos de mensalistas digitais. Criado para atender às necessidades de administradores, oferecendo controle total sobre vagas, ocupação e planos em tempo real.

## 🌐 Demonstração Online

**🚀 Acesse a aplicação em produção:**

[![Vercel](https://img.shields.io/badge/Demo_Live-Vercel-black?style=for-the-badge&logo=vercel)](https://teste-SmartPark.vercel.app/login)

**🔗 Link direto:** https://smartparkgarage.vercel.app/login

### 🔑 Credenciais de Teste
Para testar o sistema, utilize as seguintes credenciais:

```
👤 Usuário: teste@teste.com
🔒 Senha: 123456
```

> **💡 Dica:** Após fazer login, explore todas as funcionalidades do dashboard, visualize os estacionamentos e teste o gerenciamento de planos de mensalistas!

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

### **Testes**
- **Framework**: Jest 29.7.0
- **Testing Library**: React Testing Library 16.1.0
- **Cobertura**: 416 testes unitários e de integração
- **Mocks**: MSW (Mock Service Worker) para APIs

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
   cd teste_SmartPark
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   
   ```bash
   # API URLs
   NEXT_PUBLIC_API_URL=https://mock.apidog.com/m1/1076218-1064833-default
   NEXT_PUBLIC_API_URL_BACK=http://localhost:3000
   ```
   
   > **⚠️ Importante:** O arquivo `.env` já está incluído no `.gitignore` para proteger suas configurações locais. Nunca commite arquivos de ambiente com dados sensíveis!

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
npm test           # Executar todos os testes
npm run test:watch # Executar testes em modo watch
npm run test:coverage # Executar testes com relatório de cobertura
```


## 🎨 Interface e Experiência

### **Design System**
- **Cores**: Paleta oficial SmartPark com verde primário (#7ad33e)
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

## 🌐 Integração com API

### **Endpoints Principais**

A aplicação integra com uma API REST completa para gerenciamento de dados:

#### **🔐 Autenticação**
```
POST /login              # Login de usuário
```
> **Nota:** Logout é gerenciado localmente (localStorage)

#### **🏢 Estacionamentos (Garages)**
```
GET    /garages           # Listar todos os estacionamentos (com filtros opcionais)
GET    /garages/:id       # Obter estacionamento específico
```

#### **📋 Planos de Mensalistas**
```
POST   /plans                        # Criar novo plano (endpoint geral)
PUT    /plans/:id                    # Atualizar plano (endpoint geral)
POST   /garages/:garageCode/plans    # Criar plano específico de garagem
PUT    /garages/:garageCode/plans/:id # Atualizar plano específico de garagem
```
> **Nota:** A aplicação usa fallback automático entre endpoints específicos de garagem e endpoints gerais

### **Estrutura de Dados**

#### **Estacionamento (Garage)**
```typescript
interface Garage {
  id: string;
  name: string;
  code: string;
  address: string;
  branch: string;
  regional: string;
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  isActive: boolean;
}
```

#### **Plano de Mensalista**
```typescript
interface Plan {
  id: string;
  name: string;
  vehicleType: 'car' | 'motorcycle' | 'other';
  monthlyValue: number;
  dailyRotativeValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  garageId: string;
}
```

### **Configuração da API**

A aplicação utiliza Axios com interceptors para:
- **Autenticação automática**: Inclusão de tokens JWT em requisições autenticadas
- **Tratamento de erros**: Respostas padronizadas e redirecionamento em caso de token expirado
- **Fallback inteligente**: Alternância automática entre endpoints específicos e gerais
- **Base URL configurável**: Via variáveis de ambiente

```typescript
// Configuração base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Headers automáticos
Authorization: `Bearer ${token}` // Adicionado automaticamente quando token existe
Content-Type: 'application/json'
```

### **Funcionalidades Especiais da API**

#### **Sistema de Fallback para Planos**
A aplicação implementa um sistema inteligente de fallback:
1. **Primeira tentativa**: Endpoint específico da garagem (`/garages/:code/plans/:id`)
2. **Fallback automático**: Se retornar 404, usa endpoint geral (`/plans/:id`)
3. **Tratamento de erros**: Logs detalhados e mensagens de erro apropriadas

#### **Filtros Avançados para Garagens**
O endpoint `/garages` suporta filtros via query parameters:
- `search`: Busca por nome, código ou endereço
- `digitalMonthlyPayer`: Filtro por mensalistas digitais (true/false)

## 🧪 Testes

### **Cobertura de Testes**

A aplicação possui **416 testes** distribuídos em **23 suítes**, cobrindo:

- ✅ **Componentes React**: Renderização e interações
- ✅ **Hooks customizados**: Lógica de negócio
- ✅ **Serviços de API**: Requisições HTTP
- ✅ **Contextos**: Gerenciamento de estado
- ✅ **Utilitários**: Funções auxiliares
- ✅ **Páginas**: Integração completa

### **Estrutura de Testes**

```
src/
├── components/
│   ├── Component.tsx
│   └── Component.test.tsx        # Testes do componente
├── services/
│   ├── service.ts
│   └── service.test.ts           # Testes do serviço
├── utils/
│   ├── utility.ts
│   └── utility.test.ts           # Testes de utilitários
└── __tests__/                    # Testes de integração
```

### **Executando Testes**

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes específicos
npm test -- --testPathPattern=AuthContext

# Executar testes com verbose (detalhado)
npm test -- --verbose
```

### **Tecnologias de Teste**

- **Jest**: Framework principal de testes
- **React Testing Library**: Testes de componentes React
- **MSW (Mock Service Worker)**: Mock de APIs
- **Jest Environment**: jsdom para simulação do browser

### **Padrões de Teste**

- **AAA Pattern**: Arrange, Act, Assert
- **Testes unitários**: Componentes isolados
- **Testes de integração**: Fluxos completos
- **Mocks inteligentes**: APIs e dependências externas
- **Acessibilidade**: Queries por roles e labels

## 📊 Estado Atual

### **✅ Implementado**
- Sistema completo de autenticação
- Dashboard de estacionamentos
- CRUD de planos de mensalistas
- Interface responsiva
- Validações de formulário
- Sistema de notificações
- Acessibilidade em modais
- **Integração completa com API REST**
- **Cobertura de testes de 416 casos**
- **Interceptors HTTP com renovação automática de tokens**

### **🔄 Em Desenvolvimento**
- Relatórios e analytics avançados
- Sistema de notificações push
- Integração com sistemas de pagamento
- Dashboard de métricas em tempo real

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

*Sistema SmartPark - Transformando a experiência de gestão de vagas*

</div>