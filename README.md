Welcome to your Lovable Project
Informações do Projeto

URL do Projeto:
https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

Este repositório contém o código-fonte da aplicação desenvolvida por meio da plataforma Lovable, com versionamento e gerenciamento realizados via GitHub.

Diretrizes para Edição e Manutenção do Código

A aplicação pode ser editada e mantida por diferentes abordagens, conforme descrito a seguir.

1. Edição por meio da Plataforma Lovable

A forma mais direta de modificar o projeto é acessando a plataforma Lovable:

Acesse:
https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

As alterações realizadas na interface da plataforma são automaticamente versionadas e sincronizadas com este repositório.

2. Desenvolvimento Local com IDE

Para desenvolvimento local utilizando um ambiente de desenvolvimento integrado (IDE) de sua preferência, siga as instruções abaixo.

Pré-requisitos

Node.js instalado

npm (Node Package Manager)

Recomenda-se a utilização do nvm para gerenciamento de versões:
https://github.com/nvm-sh/nvm#installing-and-updating

Procedimento 

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

As alterações enviadas ao repositório remoto serão automaticamente refletidas na plataforma Lovable.

3. Edição Diretamente no GitHub

Também é possível realizar modificações diretamente pela interface web do GitHub:

Navegue até o arquivo desejado.

Selecione a opção Edit (ícone de lápis).

Realize as alterações necessárias.

Efetue o commit das modificações.

4. Utilização do GitHub Codespaces

Para desenvolvimento em ambiente remoto baseado em nuvem:

Acesse a página principal do repositório.

Clique no botão Code.

Selecione a aba Codespaces.

Crie um novo Codespace.

Edite, commit e envie (push) as alterações diretamente do ambiente provisionado.

Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

Vite (build tool e dev server)

TypeScript (tipagem estática)

React (biblioteca para construção de interfaces)

shadcn-ui (componentes de interface)

Tailwind CSS (framework utilitário de estilização)

Processo de Deploy

O processo de publicação é realizado diretamente pela plataforma Lovable.

Para publicar:

Acesse o projeto na plataforma.

Selecione a opção Share.

Clique em Publish.

Configuração de Domínio Personalizado

A plataforma oferece suporte à associação de domínios personalizados.

Para configurar:

Acesse Project > Settings > Domains.

Selecione Connect Domain.

Siga as instruções fornecidas pela plataforma.

Documentação adicional disponível em:
https://docs.lovable.dev/features/custom-domain#custom-domain
