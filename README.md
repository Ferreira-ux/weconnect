# WeConnect+

## Integrantes da Equipe

- Deborah Mendes Dantas
- Keirrison Davi de Almeida Leitão
- Raianne Maria Costa Santiago
- Suellen Ferreira da Silva
- Tamires Rayane Nascimento de Sousa

## Descrição do Sistema

O **WeConnect+** é uma plataforma de recrutamento e seleção que conecta candidatos a oportunidades de emprego e empresas a talentos qualificados. O sistema permite que empresas publiquem vagas com especificações detalhadas (tipo de contrato, modelo de trabalho — presencial, remoto ou híbrido), recebam candidaturas, avaliem currículos e gerenciem o processo seletivo de forma centralizada.

Para os candidatos, a plataforma oferece a possibilidade de criar um perfil profissional completo, anexar currículos em múltiplos formatos (PDF, Word e imagem), filtrar vagas por área, localização e tipo de contrato, se candidatar a oportunidades e acompanhar o status de suas candidaturas em tempo real. Além disso, o sistema conta com funcionalidades de chat entre candidatos e empresas, notificações em tempo real e painéis de controle dedicados para cada tipo de usuário.

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | TypeScript |
| Framework Frontend | React 18 |
| Build Tool / Dev Server | Vite 5 |
| Estilização | Tailwind CSS |
| Componentes UI | shadcn/ui + Radix UI |
| Backend / Banco de Dados | Supabase (PostgreSQL) |
| Roteamento | React Router DOM |
| Formulários | React Hook Form + Zod |
| Testes | Vitest + Testing Library |

## Desenvolvimento Local

### Pré-requisitos

- Node.js instalado
- npm (Node Package Manager)

> Recomenda-se a utilização do nvm para gerenciamento de versões:
> https://github.com/nvm-sh/nvm#installing-and-updating

### Procedimento

```sh
# Etapa 1: Clone o repositório utilizando a URL Git do projeto.
git clone <YOUR_GIT_URL>

# Etapa 2: Acesse o diretório do projeto.
cd <YOUR_PROJECT_NAME>

# Etapa 3: Instale as dependências necessárias.
npm install

# Etapa 4: Inicie o servidor de desenvolvimento com recarregamento automático e preview instantâneo.
npm run dev
```

Após a execução do servidor de desenvolvimento, a aplicação estará disponível em ambiente local com suporte a hot reload.

## Edição e Manutenção

A aplicação pode ser editada e mantida por diferentes abordagens:

1. **Plataforma Lovable** — A forma mais direta de modificar o projeto.
2. **IDE Local** — Desenvolvimento local conforme descrito acima.
3. **GitHub Web** — Edições diretamente pela interface web do GitHub.
4. **GitHub Codespaces** — Desenvolvimento remoto baseado em nuvem.

## Deploy

O processo de publicação é realizado diretamente pela plataforma Lovable.

Para publicar:
- Acesse o projeto na plataforma.
- Selecione a opção Share.
- Clique em Publish.

## Configuração de Domínio Personalizado

A plataforma oferece suporte à associação de domínios personalizados.

Para configurar:
- Acesse Project > Settings > Domains.
- Selecione Connect Domain.
- Siga as instruções fornecidas pela plataforma.

Documentação adicional disponível em: https://docs.lovable.dev/features/custom-domain#custom-domain
