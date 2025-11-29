# 🎬 Desafio Tech — Frontend

## 🧭 Índice

- [🎬 Desafio Tech — Frontend](#-desafio-tech--frontend)
- [🧠 Visão Geral](#-visão-geral)
- [🧠 Objetivo do Projeto](#-objetivo-do-projeto)
- [🧠 Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [🧱 Estrutura Inicial do Projeto](#-estrutura-inicial-do-projeto)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [🧭 Filosofia da Arquitetura](#-filosofia-da-arquitetura)
- [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🧩 Dependências do Projeto](#-dependências-do-projeto)
- [🎨 Configuração do TailwindCSS](#-configuração-do-tailwindcss)
- [🚀 Scripts Disponíveis](#-scripts-disponíveis)
- [🖥️ Pré-requisitos](#️-pré-requisitos)
- [⚡ Instalação e Execução](#-instalação-e-execução)
- [🧠 Padrões de Código](#-padrões-de-código)
- [📘 Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
- [🧾 Licença](#-licença)
- [✨ Autor](#-autor)

## 🧠 Visão Geral

Este repositório contém o **frontend** da aplicação desenvolvida em **React + TypeScript**, com **TailwindCSS** para estilização e **Vite** como bundler principal.  
O objetivo é construir uma interface moderna, performática e bem estruturada, seguindo boas práticas de desenvolvimento front-end e uma arquitetura escalável.

---

## 🎯 Objetivo do Projeto

O **Desafio Tech Frontend** tem como objetivo desenvolver uma aplicação completa para gerenciamento e exibição de filmes.  
O sistema permite **listar, filtrar, cadastrar, editar e visualizar detalhes de filmes**, além de oferecer uma interface responsiva e intuitiva.

Essa aplicação faz parte de um desafio técnico voltado à demonstração de **boas práticas de desenvolvimento, componentização e integração com API**.

---

## 🧠 Funcionalidades Implementadas

### 🧱 Layout Principal

- 🎞️ **Logo responsiva:** exibe apenas o texto **“Movies”** em telas pequenas e **“Cubos Movies”** em telas grandes.
- 🌗 **Alternância de tema (Dark/Light):** o botão de toggle altera o tema do sistema **em tempo real**,  
  salvando a preferência **tanto no `localStorage` quanto no banco de dados**, com prioridade para o valor armazenado no servidor.
- 🔔 **Notificações visuais** de sucesso, erro e ações concluídas, integradas via `react-hot-toast`.
- 🔄 **Controle de autenticação dinâmica:** o cabeçalho exibe automaticamente o botão para alternar entre **Login** e **Cadastro** quando o usuário não está logado.
- 💅 **Layout responsivo e modular:** o cabeçalho, o rodapé e o layout principal (`AppLayout`) se ajustam a diferentes resoluções de tela com base em breakpoints do Tailwind.

# 🔔 Notificações em Tempo Real

O frontend agora exibe **notificações automáticas de novos filmes publicados**, sincronizadas via **Socket.IO**.

### **Hook:** `useMovieNotifications`

- Conecta ao backend (`http://localhost:4000`)
- Ouve o evento `newNotification`
- Atualiza o estado local em tempo real

### **Componente:** `NotificationDropdown`

- Exibe o sino 🔔 com contador
- Ao clicar, mostra lista de notificações recentes
- Adapta cores conforme o tema (claro/escuro)
- Fecha automaticamente ao clicar fora

## 💅 Estilos principais

- **Fundo:** `bg-white` (tema claro) / `bg-[#1a1a1a]` (tema escuro)
- **Ícones:** `lucide-react` (`Bell`, `Film`, `CheckCircle`)
- **Cores dinâmicas:** azul → criação, verde → atualização
- **Transição suave:** `scale`, `opacity`, `translate-y` com Tailwind

---

## 🧠 Fluxo de atualização

1. Backend emite `newNotification` via Socket.IO
2. Hook `useMovieNotifications` captura o evento
3. Estado global de notificações é atualizado
4. `NotificationDropdown` exibe instantaneamente o novo item

---

### 🔐 Tela de Login

- ✅ **Autenticação completa:** login funcional com validação de credenciais via API (camada `lib/auth.ts`).
- 🔁 **Fluxo de recuperação de senha:**
  - O usuário informa o e-mail e recebe um **código de verificação**.
  - Preenche o código recebido e define a **nova senha**, que é validada localmente e enviada ao backend.
  - As senhas são comparadas para garantir que correspondem e atendem aos critérios mínimos de segurança.
- 👁️ **Exibição da senha:** o campo de senha possui ícone de “olhinho” que alterna entre **mostrar/ocultar** o conteúdo do input.
- ⚠️ **Feedback instantâneo:** mensagens de erro e sucesso são exibidas de forma visual e discreta, sem recarregar a página.

---

### 🧾 Tela de Cadastro

- 🧍‍♀️ **Formulário completo de cadastro de usuário** com campos para:

  - Nome completo
  - E-mail
  - Senha
  - Tema preferido (opções: `LIGHT` e `DARK`)

- ⚙️ **Construção dinâmica dos campos** via componente genérico `FormsFields`, permitindo:

  - Geração automática dos inputs com base na configuração `fieldsSignup`.
  - Controle centralizado de validações e valores através de `buildInitialValues`.
  - Reutilização do mesmo componente para formulários futuros (ex: edição de perfil).

- ✅ **Validação obrigatória de campos:**  
  Antes do envio, o sistema verifica se **nome, e-mail e senha** foram preenchidos.  
  Caso contrário, exibe um **toast de erro visual** com `react-hot-toast`.

- 🔐 **Processo de criação de conta:**

  - Os dados são enviados para a função `signup()` do contexto de autenticação (`AuthContext`).
  - O backend registra o usuário, incluindo o **tema preferido**, que será persistido e aplicado automaticamente no login.
  - A função lida com erros de forma segura, exibindo mensagens apropriadas e impedindo requisições duplicadas.

- 🕓 **Estado de carregamento controlado (`loading`):**  
  O botão “Cadastrar” exibe feedback visual enquanto o processo está em andamento, prevenindo múltiplos envios.

- 🎨 **Design do formulário:**

  - Fundo translúcido (`bg-[#232225]/80`) com bordas arredondadas e espaçamento uniforme.
  - Disposição centralizada verticalmente e horizontalmente na tela.
  - Responsividade garantida com limite máximo (`max-w-md`) e espaçamento adaptável.

- 🔗 **Navegação intuitiva:**

  - Link “Já tenho uma conta” redireciona o usuário para a tela de login (`/login`).
  - Mantém o fluxo de autenticação simples e direto, sem necessidade de múltiplos cliques.

- 💬 **Notificações visuais integradas:**  
  Utiliza `toast.error` para informar falhas de validação e feedbacks de processo, tornando o fluxo mais transparente e acessível para o usuário.

---

### 🎞️ Tela de Listagem de Filmes (`/movies`)

A página principal do sistema exibe todos os filmes cadastrados na plataforma, com suporte a **busca, filtragem, paginação e acesso detalhado**.

---

#### ⚙️ Estrutura e Fluxo

- 🔄 **Carregamento inicial automatizado:**  
  Assim que o componente é montado, a tela consome os dados do contexto global `MoviesContext`, que é responsável por buscar os filmes da API e controlar os estados de carregamento e paginação.

- 🎥 **Renderização dinâmica dos filmes:**

  - Cada filme é exibido dentro de um **card interativo (`MovieCard`)**, que mostra título, descrição, imagem de capa e nota média.
  - Cada card é envolto por um componente `Link`, permitindo **navegação direta para a página de detalhes** (`/movie/:id`) ao clicar no item.

  ***

- 🧭 **Navegação e experiência do usuário:**

  - Sempre que o usuário muda de página ou aplica filtros, a interface **rola suavemente até o topo** (`window.scrollTo`), garantindo uma experiência contínua e agradável.
  - Caso não existam resultados, é exibida uma **mensagem de estado vazio:**
    > “Nenhum filme encontrado.”

- ⏳ **Indicador de carregamento:**
  - Enquanto os dados estão sendo buscados, o componente `Loading` exibe a mensagem
    > “Carregando filmes...”
  - Isso mantém o usuário informado e melhora a percepção de desempenho.

---

#### 🧩 Componentes Integrados

- **`MovieActions`** →  
   Responsável pelos **filtros e ações principais** da listagem (busca por título, abertura de modal de filtros, ou cadastro de novo filme).

  ### 🎛️ Componente `MovieActions`

O componente **`MovieActions`** concentra todas as **ações de interação do usuário na listagem de filmes**, incluindo busca em tempo real, aplicação de filtros avançados e cadastro de novos filmes.  
Ele combina **interatividade, validação e integração direta** com o `MoviesContext`.

#### 🔍 Busca Inteligente

- O campo de pesquisa (`Input`) permite ao usuário buscar filmes por título.
- A busca é **reativa e controlada por debounce de 700ms**:
  - Evita múltiplas requisições consecutivas enquanto o usuário digita.
  - Apenas dispara a atualização quando o termo tem **3 ou mais caracteres** ou quando é **apagado completamente**.
- A última busca é armazenada em uma referência (`lastSearch`) para impedir repetições desnecessárias.
- O valor do campo é sincronizado com o contexto global (`filters.search`), garantindo consistência entre as telas.

#### ⚙️ Filtros Avançados

- O botão **“Filtros”** abre um modal customizado (`Modal`) contendo o componente dinâmico `FormsFields`.
- Esse formulário utiliza a configuração `fieldsSearch` (vinda de `utils/fields.ts`) para gerar os campos de filtro de forma automática e flexível.
- Antes de aplicar os filtros, o sistema executa a validação via `validateRequiredFields()`, exibindo um **toast de erro visual** caso algum campo obrigatório não tenha sido preenchido.
- Ao aplicar, os filtros são enviados ao contexto global `MoviesContext` para atualizar a listagem.
- É possível:
  - 🧹 **Limpar filtros** — botão “Limpar” remove todos os valores e reseta o estado global.
  - 🚫 **Cancelar** — fecha o modal sem alterar os filtros.
- O modal exibe seus botões de ação dinamicamente com base em `activeFilters`.

#### 🎬 Cadastro de Filmes

- O botão **“Adicionar Filme”** abre um drawer lateral (`MovieDrawer`) no modo de criação (`mode="create"`).
- Ao salvar um novo filme:
  - A função `onSaved` chama `refreshMovies()` para atualizar automaticamente a listagem principal.
  - O drawer é fechado (`setOpenDrawer(false)`), garantindo um fluxo limpo e intuitivo.
- O componente utiliza **design responsivo e adaptável**:
  - Os botões ficam lado a lado em telas grandes (`md:flex-row`).
  - Em dispositivos menores, se organizam verticalmente (`flex-col`).

#### 🧠 Integração e Estado

O componente trabalha em conjunto com o `MoviesContext`, controlando:

| Estado / Função   | Descrição                                                                                 |
| :---------------- | :---------------------------------------------------------------------------------------- |
| `filters`         | Estado global com filtros aplicados.                                                      |
| `setFilters()`    | Atualiza filtros globais e dispara nova busca.                                            |
| `refreshMovies()` | Recarrega a listagem completa após adições ou alterações.                                 |
| `localFilters`    | Cópia local dos filtros usada no modal para edição sem impactar o contexto imediatamente. |

#### 🎨 Experiência e Layout

- Layout adaptável e alinhado ao padrão visual da aplicação.
- Organização horizontal em telas médias e grandes, com botões de ação à direita.
- Uso de espaçamento fluido (`gap-2`, `md:gap-3`) e tamanhos padronizados (`h-[48px]`) para consistência entre botões.
- Feedbacks visuais (modais, toasts, estados de loading) reforçam **clareza e previsibilidade** das ações.

> 💡 **Resumo:**  
> O `MovieActions` atua como o **painel de controle da listagem de filmes**, oferecendo busca reativa, filtros inteligentes e criação rápida de novos itens — tudo conectado de forma fluida ao contexto global e com feedback visual instantâneo.

---

- **`MovieCard`** →  
  Exibe cada filme com **imagem, título, descrição curta e nota**, mantendo consistência visual.

  ### 🎞️ Componente `MovieCard`

O componente **`MovieCard`** é responsável por exibir cada filme da listagem com **interatividade, visual dinâmico e pré-visualização multimídia**.

#### ⚙️ Estrutura e Comportamento

- 📸 **Imagem de capa com fallback automático:**  
  Caso o filme não possua imagem (`imageCover`) ou ocorra erro de carregamento, é exibido o placeholder padrão `not_found_image.svg`.

- 🎬 **Pré-visualização inteligente (`linkPreview`):**

  - Se o link for um vídeo do **YouTube**, o card detecta automaticamente o ID usando a função utilitária `getYouTubeId()` e exibe o vídeo embutido via `iframe`.
  - Se o link for um **vídeo direto** (`.mp4`, `.mov`, `.webm`, `.ogg`), o card exibe o preview através de uma tag `<video>` com reprodução automática, silenciosa e em loop.
  - Caso o link seja inválido ou cause erro, o preview é desativado e o fallback visual é mantido.

- ⏱️ **Delay inteligente de pré-visualização:**

  - O preview só aparece após o usuário manter o cursor **por 2 segundos** sobre o card.
  - Esse atraso é controlado por `setTimeout` e evita que vídeos sejam carregados acidentalmente durante rolagem ou interações rápidas.

- 🧠 **Controle de estados e comportamento de hover:**
  - `hover` → controla quando o cursor está sobre o card.
  - `showPreview` → exibe o vídeo/imagem de preview.
  - `previewError` e `imageError` → tratam falhas de mídia de forma segura, sem quebrar o layout.
  - Todos os estados são limpos automaticamente no `useEffect` para evitar vazamento de memória.

#### 🧩 Interações e UX

- 🎞️ **Animações fluidas com `framer-motion`:**

  - Transições suaves no hover (`opacity`, `scale`) deixam o card responsivo e elegante.
  - A nota do filme (`RatingCircle`) aparece centralizada com efeito de fade-in/out durante o hover.

- 🧭 **Camada de destaque:**

  - Um gradiente no rodapé (`from-black/80 via-black/50 to-transparent`) garante **leitura clara do título e descrição** mesmo sobre vídeos ou imagens claras.
  - Ao passar o mouse, a descrição é exibida com truncamento de duas linhas (`line-clamp-2`), mantendo o layout limpo.

- 💅 **Layout responsivo:**

  - Dimensões adaptáveis:
    - `w-[35vw] max-w-[183px]` em telas pequenas.
    - `sm:w-[40vw] sm:max-w-[235px]` em telas médias e grandes.
  - Proporção fixa (`aspect-[183/281]` → `aspect-[235/355]`) para uniformizar todos os cards.
  - Bordas arredondadas (`rounded-[4px]`) e overflow controlado para manter o conteúdo ajustado.

- 🎨 **Feedback visual:**
  - Efeito de **hover com leve zoom (`hover:scale-[1.02]`)**, transmitindo sensação de interação.
  - Fundo de fallback escuro (`bg-[#111]`) evita áreas vazias enquanto imagens carregam.

#### 🧠 Integração e Reutilização

O `MovieCard` foi desenvolvido para ser **autônomo e reutilizável**:

- Pode ser utilizado em listagens, seções de destaque ou recomendações.
- Recebe suas propriedades via props (`title`, `description`, `rating`, `imageCover`, `linkPreview`).
- Utiliza o componente interno `RatingCircle` para exibir visualmente a pontuação média.

> 💡 **Resumo:**  
> O `MovieCard` une **interatividade, animação e acessibilidade**, exibindo filmes com uma experiência visual rica, carregamento otimizado e tratamento completo de erros.  
> Ele representa o **coração visual** da aplicação, garantindo uma exibição moderna e funcional para cada item da listagem.

---

- **`Pagination`** →  
  Controla a navegação entre páginas de resultados.

  ### 🔢 Componente `Pagination`

O componente **`Pagination`** é responsável por controlar a **navegação entre páginas de filmes**, exibindo botões dinâmicos e adaptando automaticamente o layout conforme o número total de páginas.

#### ⚙️ Estrutura e Lógica

- O componente recebe três propriedades principais:
  | Propriedade | Tipo | Descrição |
  | :----------- | :--- | :---------- |
  | `currentPage` | `number` | Página atual da listagem. |
  | `totalPages` | `number` | Total de páginas disponíveis. |
  | `onPageChange` | `(page: number) => void` | Função executada ao alterar de página. |

- 📄 **Lógica de exibição das páginas (`getPagesToDisplay`):**
  - Se houver até **7 páginas**, todas são exibidas normalmente.
  - Quando há mais páginas, o componente exibe uma **navegação inteligente com reticências (`...`)**, garantindo clareza sem sobrecarregar a UI.
  - O comportamento se adapta conforme a posição atual:
    - 🔹 Nas primeiras páginas: mostra `1 2 3 4 5 … último`.
    - 🔹 No meio: mostra `1 … anterior atual próximo … último`.
    - 🔹 Nas últimas páginas: mostra `1 … n-4 n-3 n-2 n-1 n`.

#### 🧭 Navegação

- O botão **anterior (`<`)** retrocede uma página, enquanto o botão **próximo (`>`)** avança uma página.
- Ambos são desabilitados quando o usuário está na **primeira** ou **última** página, respectivamente.
- Cada botão numérico chama `onPageChange()` com o número da página clicada.
- O botão correspondente à página atual é destacado visualmente e desabilitado.

#### 🎨 Estilização e Layout

- Design responsivo e centrado (`flex items-center justify-center flex-wrap`).
- Cada botão possui **tamanho fixo e uniforme** (`w-[49px] h-[44px]`), mantendo o alinhamento perfeito em qualquer resolução.
- Cores e efeitos:
  - Página ativa → fundo **roxo** (`bg-[#8E4EC6]`) com texto branco.
  - Páginas inativas → fundo escuro (`bg-[#1a1a1a]`) e **hover suave** (`hover:bg-[#2a2a2a]`).
  - Reticências (`...`) aparecem como elementos visuais neutros (`text-gray-400`).
- Botões de navegação (`<`, `>`) utilizam ícones da biblioteca **Lucide React** (`ChevronLeft`, `ChevronRight`).

#### 🧠 Comportamento e Acessibilidade

- **Desabilitação inteligente:**

  - Impede navegação para páginas inexistentes, adicionando `disabled` e `cursor-not-allowed`.
  - Diminui a opacidade de botões inativos para reforçar o estado visual.

- **Feedback imediato:**
  - A navegação entre páginas é instantânea e fluida, sem reloads de página.
  - O componente é compatível com contextos reativos como `MoviesContext`.

> 💡 **Resumo:**  
> O `Pagination` fornece uma **experiência de navegação simples, visualmente elegante e eficiente**, adaptando-se automaticamente à quantidade de páginas e garantindo uma interação intuitiva, mesmo em grandes volumes de dados.

#### 🎨 🧩 Ajuste de UX — Inversão de Cores do Estado Ativo

Durante os testes de uso, foi identificado que o esquema inicial — **botão ativo em cinza e inativo em roxo** — **gerava ambiguidade visual**, pois o botão ativo parecia desabilitado, dando a sensação de que **a interação estava bloqueada**, quando na verdade representava a página atual.

Para melhorar a **clareza e consistência da experiência do usuário**, as cores foram **invertidas**:

- Agora, o botão **ativo** é destacado em **roxo (`#8E4EC6`)**, indicando de forma clara **a página atual**.
- Os botões **inativos** permanecem em **cinza escuro**, ganhando leve destaque roxo apenas ao passar o mouse, para reforçar a possibilidade de clique.

Esse ajuste tornou a navegação **mais intuitiva e visualmente coerente**, permitindo que o usuário identifique rapidamente em qual página está e quais páginas ainda pode acessar.

---

- **`Loading`** →  
  Feedback visual enquanto a API é carregada, com texto customizável.

### ⏳ Componente `Loading`

O componente **`Loading`** representa a tela de carregamento global da aplicação, combinando **animações contínuas, efeitos visuais sutis e tipografia personalizada** para criar uma sensação de fluidez e imersão enquanto os dados são processados.

#### ⚙️ Estrutura e Propriedades

| Propriedade | Tipo                  | Descrição                                                                                       |
| :---------- | :-------------------- | :---------------------------------------------------------------------------------------------- |
| `text`      | `string` _(opcional)_ | Define o texto exibido durante o carregamento. O valor padrão é `"Preparando o espetáculo..."`. |

#### 🧩 Camadas e Efeitos Visuais

O layout utiliza **múltiplas camadas animadas com `framer-motion`**, criando um efeito de profundidade e movimento:

1. **Faixa superior dinâmica:**

   - Uma sequência horizontal de blocos (`25` elementos) desliza continuamente da direita para a esquerda (`animate: x: ["0%", "-50%"]`).
   - Essa camada adiciona **movimento sutil e ritmo visual**, remetendo a uma película de filme em rolagem.

2. **Luz difusa central:**

   - Um círculo gigante com `blur-[120px]` e opacidade suave (`bg-purple-600/40`) cria um **efeito de brilho ambiente**, trazendo destaque e equilíbrio ao centro da tela.

3. **Spinner duplo em rotação contínua:**

   - O círculo externo gira em sentido horário (`rotate: 360`), enquanto o interno gira no sentido oposto (`rotate: -360`).
   - As bordas alternadas (`border-t-transparent`, `border-b-transparent`) criam uma sensação de fluidez e velocidade, simulando um **carretel cinematográfico**.

4. **Texto animado:**

   - O texto principal é exibido com **pulso de opacidade e leve flutuação vertical** (`opacity: [0.6, 1, 0.6]`, `y: [10, 0, 10]`).
   - Transmite a ideia de **expectativa controlada**, mantendo o usuário engajado durante o carregamento.

5. **Gradiente de fundo animado:**
   - Uma camada extra (`bg-gradient-to-b from-purple-800/20 via-transparent to-purple-900/30`) aparece e desaparece em loop, reforçando o dinamismo sem causar distração.

#### 🎨 Estilo e Layout

- Layout centralizado e 100% responsivo (`flex items-center justify-center h-screen`).
- Paleta **baseada em tons de roxo e preto**, coerente com o tema escuro da aplicação.
- Tipografia uppercase com espaçamento largo (`tracking-[0.25em]`) para transmitir modernidade e identidade visual.
- Todas as transições utilizam **`ease: "linear"`** ou **`easeInOut`** para garantir suavidade e continuidade.
- A tela cobre toda a viewport (`w-full h-screen`) e desabilita interação (`select-none`), mantendo o foco visual no carregamento.

#### ⚡ Experiência do Usuário

- O componente substitui o conteúdo principal da tela durante carregamentos de API ou mudanças de contexto global.
- A ambientação visual (“**Preparando o espetáculo...**”) transforma o tempo de espera em uma **parte da experiência cinematográfica**, reforçando a identidade do produto.
- Todas as animações são **otimizadas e contínuas**, sem uso de timers que causem travamentos.

> 💡 **Resumo:**  
> O `Loading` vai além de um simples indicador de progresso — ele é uma **transição de estado imersiva**, projetada para manter o usuário engajado e reforçar a identidade visual da aplicação enquanto os dados são carregados.

---

## 🎬 Tela de Detalhes do Filme (`/movie/:id`)

A tela **`MovieDetails`** exibe todas as informações detalhadas de um filme, permitindo **visualização, edição, exclusão e navegação multimídia**.  
Ela combina **camadas visuais, dados estruturados e interação condicional** baseada no usuário logado.

---

### ⚙️ Estrutura e Fluxo de Lógica

- A tela utiliza o **parâmetro de rota (`useParams`)** para identificar o `id` do filme e buscar seus dados através da função `getMovieById()`.
- Durante o carregamento, é exibido o componente `Loading` com o texto **“Carregando filme…”**.
- O tratamento de erros diferencia três estados:

  - 🚫 **403 (Acesso Negado):** exibe `NotFoundState` informando que o filme é privado.
  - ❌ **404 (Não Encontrado):** exibe `NotFoundState` indicando remoção ou indisponibilidade.
  - ⚠️ **Outros erros:** exibem notificação visual (`toast.error`).

- A função `loadMovie()` faz:
  - Mapeamento dos campos do backend (ex: datas, arrays de atores, gêneros e produtores).
  - Normalização de valores para renderização amigável e segura.
  - Conversão de formatos numéricos (`ratingAvg`, `budget`, `revenue`, etc.).

---

### 🧠 Estados Principais

| Estado            | Tipo                                | Descrição                                               |
| :---------------- | :---------------------------------- | :------------------------------------------------------ |
| `movie`           | `object`                            | Contém todos os dados carregados do filme.              |
| `loading`         | `boolean`                           | Controla o estado de carregamento inicial.              |
| `openDeleteModal` | `boolean`                           | Define se o modal de exclusão está aberto.              |
| `openEditDrawer`  | `boolean`                           | Define se o drawer de edição está aberto.               |
| `errorType`       | `"notFound" \| "forbidden" \| null` | Controla a exibição de estados de erro.                 |
| `hasValidImage`   | `boolean`                           | Verifica se a imagem de capa é válida.                  |
| `loadingReqs`     | `boolean`                           | Indica se uma requisição de exclusão está em andamento. |

---

### 🧩 Funcionalidades

- 🔄 **Carregamento dinâmico de filme:** busca automatizada ao acessar `/movie/:id`.
- 🧾 **Exibição de detalhes completos:** título, título original, sinopse, classificação, duração, data de lançamento, idioma, status, orçamento, receita e lucro.
- 🎭 **Listagem de equipe técnica:** inclui **diretor, elenco e produtores**, renderizados pelo componente `MovieTeam`.
- 🎞️ **Trailer incorporado:** o campo `linkPreview` é exibido via componente `MovieTrailer`, suportando vídeos do YouTube.
- ⭐ **Indicadores visuais:**
  - `RatingCircle` exibe a média de avaliações de forma gráfica.
  - `InfoCard` organiza informações como idade indicativa, votos, orçamento, idioma e status.

---

### 🧮 Ações Disponíveis

- 🧑‍💼 **Edição:**

  - Disponível apenas para o usuário criador (`movie.userId === user.id`).
  - Abre o `MovieDrawer` em modo de edição (`mode="edit"`).
  - Após salvar, o filme é atualizado localmente sem recarregar a página.

- 🗑️ **Exclusão:**
  - Também restrita ao criador do filme.
  - Exibe modal de confirmação (`Modal`) antes da ação.
  - Após exclusão bem-sucedida:
    - Mostra `toast.success("Filme deletado com sucesso!")`.
    - Redireciona automaticamente para `/movies`.

---

### 🎨 Layout e Experiência do Usuário

- Fundo superior com **imagem do pôster em opacidade reduzida** (`bg-black/80`) cria imersão cinematográfica.
- Exibição de imagem de capa adaptável:
  - Em telas pequenas: imagem centralizada.
  - Em telas grandes: posicionada à esquerda do conteúdo.
- Uso consistente de `InfoCard` para manter uma **hierarquia visual uniforme**.
- Responsividade garantida com **grid flexível (`grid-cols-1 md:grid-cols-3`)** e espaçamentos proporcionais (`gap-6`).
- Botões e elementos interativos utilizam a mesma identidade visual global (`primary` e `secondary`).

---

### ⚡ UX e Feedback Visual

- Transições suaves ao carregar ou alterar o estado do filme (`window.scrollTo({ behavior: "smooth" })`).
- `toast` utilizado para todos os feedbacks de sucesso e erro.
- Modal de confirmação enfatiza a **irreversibilidade da exclusão**, garantindo segurança ao usuário.
- Estados de erro personalizados reforçam clareza e empatia na comunicação.

---

### ✨ Novidades Recentes

#### 🔧 Header aprimorado

- Adicionado botão de **Configurações (⚙️)** no topo direito.
- Redireciona para a página **“Meus Filmes”** (`/config/movies`).
- Mantém o estilo circular e responsivo, seguindo o padrão dos ícones 🔔 e 🌙.
- Totalmente adaptado ao **tema claro/escuro**.

#### 🎬 Página “Meus Filmes” (`/config/movies`)

- Integração dos botões de controle:
  - **Status:** alterna entre `Publicado` e `Rascunho`.
  - **Visibilidade:** alterna entre `Público` e `Privado`.
- Ambos os botões agora:
  - São **proporcionais ao tamanho do card**.
  - Ficam **centralizados e alinhados verticalmente**.
  - Possuem **cores e bordas consistentes** com o tema atual.
- Layout otimizado no grid responsivo de filmes.

### 🧱 Componentes Envolvidos

| Componente          | Função                                                                  |
| :------------------ | :---------------------------------------------------------------------- |
| **`InfoCard`**      | Estrutura de exibição padronizada para informações (título + conteúdo). |
| **`Button`**        | Ações principais e secundárias (Editar, Deletar, Confirmar, Cancelar).  |
| **`RatingCircle`**  | Indicador gráfico de pontuação do filme.                                |
| **`Modal`**         | Confirmação de exclusão com botões dinâmicos.                           |
| **`Loading`**       | Tela de carregamento inicial.                                           |
| **`NotFoundState`** | Estado visual de erro (403 / 404).                                      |
| **`MovieTrailer`**  | Exibição de vídeos de preview do filme.                                 |
| **`MovieDrawer`**   | Edição inline do filme em painel lateral.                               |
| **`MovieTeam`**     | Renderização dos membros da equipe (diretor, atores, produtores).       |

---

> 💡 **Resumo:**  
> A página de **detalhes do filme** entrega uma experiência completa e imersiva, equilibrando **estética cinematográfica, interatividade e clareza funcional**.  
> Cada ação foi cuidadosamente desenhada para oferecer **fluidez, segurança e consistência visual** em todos os estados possíveis (carregamento, erro, exibição e edição).

---

#### 🎨 Layout e Estilo

- Estrutura centralizada com `max-w-8xl`, garantindo **consistência visual** em resoluções grandes.
- Fundo translúcido com bordas suaves (`bg-[#ebeaf8]/[0.05]`, `border-[#ebeaf8]/[0.08]`) cria um contraste elegante com o tema escuro.
- Espaçamento interno (`p-6 sm:p-8`) e `gap-8` entre blocos garantem **hierarquia visual clara e respirável**.
- Layout em **grid responsivo**, que se adapta automaticamente para:
  - 2 colunas em telas pequenas,
  - 3 em médias,
  - até 5 colunas em telas grandes.

---

#### 🧠 Contexto e Estados

A tela utiliza o **`MoviesContext`** para controlar:

| Estado             | Descrição                                                                        |
| :----------------- | :------------------------------------------------------------------------------- |
| `data`             | Lista atual de filmes carregados da API.                                         |
| `loading`          | Indica se a listagem está em carregamento.                                       |
| `page`             | Página atual da listagem.                                                        |
| `totalPages`       | Total de páginas disponíveis.                                                    |
| `loadMovies(page)` | Função responsável por buscar os filmes com base na página ou filtros aplicados. |

---

> 💡 **Resumo:**
> A tela de `/movies` representa o **núcleo da aplicação**, exibindo os filmes de forma visual e interativa.
> Combina **performance, responsividade e clareza visual**, garantindo uma navegação fluida e agradável mesmo em grandes volumes de dados.

### 🧩 Recursos Gerais

- ⚙️ **Validação e tratamento de formulários** com funções utilitárias reutilizáveis (`validateRequiredFields`, `handleChangeInput`).
- ⚡ **Requisições assíncronas centralizadas** na camada `lib/`, garantindo isolamento entre front e API.
- 🧭 **Navegação SPA** fluida com `react-router-dom`, sem recarregar a página.
- 🚦 **Proteção de rotas privadas** via `ProtectedRoute`, restringindo o acesso a páginas internas apenas para usuários autenticados.
- 🧩 **Gerenciamento de contexto global de autenticação** (`AuthContext`), mantendo o estado do usuário ativo em toda a aplicação.

---

> 🧩 **Em resumo:**
> A aplicação foi construída com foco em **experiência do usuário, consistência visual e arquitetura modular**, garantindo que todas as interações —
> desde login até o gerenciamento de filmes — sejam intuitivas, performáticas e seguras.

---

## 🧱 Estrutura Inicial do Projeto

O projeto foi iniciado com **React + TypeScript + TailwindCSS**, seguindo uma arquitetura modular e organizada desde o primeiro commit.
A estrutura foi planejada para garantir **escalabilidade**, **reutilização de componentes** e **padronização visual** desde o início.

### 🧠 **Node.js 20.19.0 + npm**

Ambiente base de execução e gerenciamento de dependências.
A versão **20.25.0** foi escolhida por sua estabilidade LTS e compatibilidade com o ecossistema moderno do React e Vite.

---

### 📂 Estrutura de Pastas

src/
├── assets/
│
├── components/
│ ├── common/
│ │ ├── Button.tsx
│ │ ├── Drawer.tsx
│ │ ├── FormsFields.tsx
│ │ ├── Input.tsx
│ │ ├── Loading.tsx
│ │ ├── Modal.tsx
│ │ ├── NotFoundState.tsx
│ │ ├── Pagination.tsx
│ │ ├── Select.tsx
│ │ ├── Textarea.tsx
│ │
│ ├── layout/
│ │ ├── AppLayout.tsx
│ │ ├── Footer.tsx
│ │ ├── Header.tsx
│ │
│ ├── movies/
│ ├── InfoCard.tsx
│ ├── MovieActions.tsx
│ ├── MovieCard.tsx
│ ├── MovieDrawer.tsx
│ ├── MovieTeam.tsx
│ ├── MovieTrailer.tsx
│ ├── RatingCircle.tsx
│
├── context/
│ ├── AuthContext.tsx
│ ├── MoviesContext.tsx
│
├── hooks/
│ ├── useMovies.ts
│ ├── useTheme.ts
│
├── lib/
│ ├── api.ts
│ ├── auth.ts
│ ├── movies.ts
│ ├── Notifications.ts
│ ├── passwordReset.ts
│ ├── users.ts
│
├── pages/
│ ├── Home.tsx
│ ├── Login.tsx
│ ├── MovieDetails.tsx
│ ├── NotFound.tsx
│ ├── Signup.tsx
│
├── routes/
│ ├── AppRoutes.tsx
│ ├── ProtectedRoute.tsx
│
├── types/
│ ├── auth.ts
│ ├── movies.ts
│ ├── user.ts
│
├── utils/
│ ├── fields.ts
│ ├── handleChangeInput.ts
│ ├── pathVideo.ts
│ ├── validateRequiredFields.ts
│
├── App.css
├── App.tsx
├── index.css
├── main.tsx
│
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
├── vite.config.ts
├── package.json
├── package-lock.json
└── README.md

---

**📌 Organização:**

- **assets/** → arquivos estáticos e imagens do projeto.
- **components/** → contém todos os componentes reutilizáveis da aplicação.
  - **common/** → componentes genéricos (botões, modais, inputs, loaders, etc.).
  - **layout/** → estrutura base da interface (Header, Footer, Layout principal).
  - **movies/** → componentes específicos do domínio de filmes (cards, drawer, trailer, rating, etc.).
- **context/** → contextos globais de autenticação e gerenciamento de filmes.
- **hooks/** → hooks customizados de lógica compartilhada (`useMovies`, `useTheme`).
- **lib/** → camada de comunicação com a API e serviços auxiliares.
- **pages/** → telas principais da aplicação (Home, Login, Detalhes, etc.).
- **routes/** → gerenciamento das rotas públicas e protegidas.
- **types/** → definições de tipos TypeScript utilizadas em todo o projeto.
- **utils/** → funções utilitárias e auxiliares (validações, formatação, campos dinâmicos).
- **configs (raiz)** → arquivos de configuração do Vite, Tailwind, TypeScript, ESLint e PostCSS.

---

## 🧭 Filosofia da Arquitetura

A arquitetura do projeto foi construída com base em **princípios de componentização, reuso e separação de responsabilidades**, inspirada em conceitos do **Atomic Design** e em práticas modernas de **Clean Architecture** para aplicações front-end.

### 🧩 Princípios Fundamentais

- **Componentização por domínio**
  Cada módulo (`movies/`, `common/`, `layout/`, etc.) foi organizado por escopo funcional, facilitando a manutenção e a escalabilidade do sistema.
  Assim, cada parte da interface conhece apenas o que precisa — evitando dependências desnecessárias.

- **Reutilização e consistência visual**
  Componentes genéricos e reutilizáveis ficam centralizados em `common/`, garantindo **padronização visual**, **menor duplicação de código** e **facilidade de evolução** da UI.

- **Responsabilidade única (Single Responsibility)**
  Cada componente e arquivo possui uma função clara: seja exibir informações, manipular dados, ou configurar rotas/contextos.
  Essa divisão permite um fluxo mais previsível e reduz o acoplamento entre as camadas.

- **Clean Architecture aplicada ao front-end**
  As pastas `lib/`, `context/`, `hooks/`, `types/` e `utils/` seguem uma separação de camadas inspirada na Clean Architecture:

  - **`lib/`** → comunicação com APIs externas e integrações.
  - **`context/`** → controle de estado global e regras de negócio compartilhadas.
  - **`hooks/`** → abstração de lógicas específicas e reutilizáveis.
  - **`types/`** → contratos de dados e tipagens centralizadas.
  - **`utils/`** → funções puras e utilitárias.

- **Previsibilidade e clareza**
  O código segue um padrão de nomenclatura intuitivo e uniforme.
  Arquivos e componentes são nomeados de forma descritiva, facilitando a navegação e entendimento rápido por novos desenvolvedores.

---

> 🧠 **Resumo:**
> O foco desta arquitetura é proporcionar **clareza**, **escalabilidade** e **organização modular**, mantendo uma curva de aprendizado suave e permitindo crescimento sustentável do projeto sem perda de controle estrutural.

## ⚙️ Tecnologias Utilizadas

### 🧩 **React + TypeScript**

Escolhidos pela **robustez, tipagem estática e componentização moderna**.
O uso de **TypeScript** garante segurança e previsibilidade durante o desenvolvimento, reduzindo erros e facilitando manutenção e refatoração.

### ⚡ **Vite**

Ferramenta de build moderna e ultrarrápida, usada para desenvolvimento e empacotamento da aplicação.
Vantagens:

- Hot Reload instantâneo
- Suporte nativo a TypeScript e JSX
- Build otimizado e leve

### 🎨 **TailwindCSS**

Framework utilitário para estilização rápida e consistente.
A escolha foi feita para garantir:

- Padronização visual alinhada ao design system (Figma)
- Produtividade no desenvolvimento com classes utilitárias
- Suporte nativo a **modo escuro** e responsividade fluida

## 🧩 Dependências do Projeto

### 📦 **Dependências principais**

| Pacote                    | Função                                           |
| :------------------------ | :----------------------------------------------- |
| **react** / **react-dom** | Base do framework e renderização dos componentes |
| **axios**                 | Comunicação com a API backend                    |
| **react-router-dom**      | Gerenciamento de rotas SPA                       |
| **tailwindcss**           | Estilização com classes utilitárias              |
| **lucide-react**          | Biblioteca de ícones minimalistas e escaláveis   |
| **framer-motion**         | Animações declarativas e fluidas                 |
| **react-hot-toast**       | Notificações de feedback para o usuário          |
| **clsx**                  | Combinação condicional de classes CSS            |

### 🧰 **Dependências de desenvolvimento**

| Pacote                         | Função                                       |
| :----------------------------- | :------------------------------------------- |
| **vite**                       | Bundler rápido e moderno                     |
| **typescript**                 | Tipagem estática e integração com React      |
| **eslint / typescript-eslint** | Padronização e qualidade de código           |
| **autoprefixer / postcss**     | Compatibilidade automática entre navegadores |
| **@vitejs/plugin-react**       | Suporte aprimorado para React no Vite        |
| **globals**                    | Definições globais para ESLint e TypeScript  |

## 🎨 Configuração do TailwindCSS

O projeto utiliza **TailwindCSS** com configuração personalizada para refletir a paleta do Figma e suportar **modo claro/escuro**.

### 🧰 Arquivo de configuração (`tailwind.config.js`)

## 🚀 Scripts Disponíveis

| Comando           | Descrição                                                          |
| :---------------- | :----------------------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com **Vite**                  |
| `npm run build`   | Realiza a build de produção e compila os tipos **TypeScript**      |
| `npm run preview` | Pré-visualiza o build gerado localmente                            |
| `npm run lint`    | Executa o **ESLint** para validação e correção de estilo de código |

---

## 🖥️ Pré-requisitos

Certifique-se de ter instalado:

- **Node.js 20.25.0**
- **npm** (gerenciador de pacotes padrão)

---

## ⚡ Instalação e Execução

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/gabrielliborges-web/mkp-gerencia.git

# 2️⃣ Acesse a pasta do projeto
cd mkp-gerencia

# 3️⃣ Instale as dependências
npm install

# 4️⃣ Inicie o servidor de desenvolvimento
npm run dev

```

O projeto estará disponível em:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧠 Padrões de Código

- **TypeScript + ESLint** → garante padronização e segurança de tipos.
- **Arquitetura por domínio** → cada módulo (ex: `movies/`, `filters/`) possui seus próprios componentes e responsabilidades.
- **Componentes reutilizáveis** → tudo que pode ser reaproveitado está dentro de `common/`.
- **Estilização declarativa** → **TailwindCSS** aplicado de forma semântica e consistente.

---

## 📘 Modelagem do Banco de Dados

> A modelagem de dados é utilizada para integração com o backend, refletindo as entidades de **Filmes**, **Gêneros** e **Avaliações**.

![Movies Models](./src/assets/movies_models.png)

---

## 🧾 Licença

Este projeto é distribuído sob a licença **MIT**, permitindo uso, modificação e distribuição livre, desde que o crédito seja mantido.

---

## ✨ Autor

**Desenvolvido por [Gabrielli Borges](https://github.com/gabrielliborges-web)**
💡 _Desenvolvedora Full Stack_ | React • Node.js • TypeScript • Tailwind • Prisma • PostgreSQL
