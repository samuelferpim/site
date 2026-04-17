# Referência de tags e componentes de conteúdo

Tudo que você pode usar em `src/content/` — frontmatter, componentes MDX, diretivas e blocos de código.

---

## 1. Frontmatter de **posts** (`src/content/posts/<locale>/*.md|.mdx`)

Schema definido em `src/content/config.ts`. Campos com ✅ são obrigatórios.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | ✅ | Título exibido no card, `<h1>` e `<title>` |
| `published` | Date (`YYYY-MM-DD`) | ✅ | Data de publicação. Usada na ordenação e schema.org |
| `category` | string \| string[] | ✅ | Categoria (ou lista). Vira filtro no `/archive/` |
| `updated` | Date | — | Data de última atualização. Aparece com sufixo `(Updated)` |
| `description` | string | — | Subtítulo / resumo. Usado no `<meta description>` e OG. Se vazio, usa excerpt do primeiro parágrafo |
| `image` | string | — | Capa. Caminho relativo (ex: `../images/foo.webp`) ou URL absoluta. Aparece no card e como OG image |
| `tags` | string[] | — | Tags livres. Viram filtros no `/archive/` |
| `draft` | boolean | — | Se `true`, oculta em produção (dev mostra) |
| `lang` | string | — | Idioma do post. **Opcional** — o locale é inferido pela pasta (`en/` ou `pt-BR/`). Só preencha se quiser sobrescrever |

**Campos internos (não preencher à mão):**
`prevTitle`, `prevSlug`, `nextTitle`, `nextSlug` — gerados no build.

### Exemplo mínimo

```markdown
---
title: "Meu Post"
published: 2026-04-16
category: "Dev"
---
```

### Exemplo completo

```markdown
---
title: "Título do Post"
published: 2026-04-16
updated: 2026-04-20
description: "Resumo que aparece no card e no SEO."
image: "../images/capa.webp"
tags: ["astro", "tutorial", "svelte"]
category: ["Engineering", "Web"]
draft: false
---
```

### Convenção de i18n

- Posts traduzidos devem ter o **mesmo caminho lógico** (depois do locale):
  - `src/content/posts/en/my-post.md`
  - `src/content/posts/pt-BR/my-post.md`
- Isso liga as duas versões para prev/next e troca de idioma.

---

## 2. Frontmatter de **portfolio** (`src/content/portfolio/*.md`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | ✅ | Nome do projeto |
| `description` | string | ✅ | Descrição curta no card |
| `image` | string | ✅ | Capa. Se a `url` apontar para um post interno, a imagem do post é reusada |
| `url` | string | ✅ | Link do card. Aceita URL externa ou interna (`/posts/...`) |
| `category` | string | — | Categoria (default: `"Project"`) |
| `date` | Date | — | Quando aponta para post interno, vem do `published` do post |
| `order` | number | — | Ordenação (default 0, maior primeiro) |
| `lang` | string | — | Locale — normalmente vazio; herda da pasta |

---

## 3. Frontmatter de **spec** (`src/content/spec/*.md`)

Coleção para páginas estáticas (About, Profile, Portfolio intro, futuro CV). **Schema vazio** — pode deixar sem frontmatter ou só com `---` vazio.

Arquivos esperados pelo código:
- `spec/about.md` → usado por `/about/` (default)
- `spec/<locale>/about.md` → `/<locale>/about/`
- `spec/<locale>/profile.md` → `/<locale>/profile/`
- `spec/profile.md` → `/profile/`
- `spec/<locale>/portfolio.md` → intro da página de portfólio
- `spec/portfolio.md` → intro default

---

## 4. Sintaxe MDX (posts `.mdx`)

Além de Markdown normal, arquivos `.mdx` aceitam:

### 4.1 Importar componentes

```mdx
import ScientificMacroCalc from '../../../components/ScientificMacroCalc.jsx'

<ScientificMacroCalc client:visible accentColor="#3b82f6" lang="pt-BR" />
```

Diretivas `client:*` aceitas pelo Astro:
- `client:load` — hidrata no load
- `client:idle` — hidrata quando idle
- `client:visible` — hidrata ao ficar visível (default recomendado)
- `client:only="react"` / `"svelte"` — só no client, sem SSR

### 4.2 Expressões JS

```mdx
export const year = new Date().getFullYear()

Estamos em {year}.
```

---

## 5. Diretivas customizadas (funcionam em `.md` e `.mdx`)

### 5.1 Admonitions
Cinco tipos: `note`, `tip`, `important`, `caution`, `warning`.

```markdown
:::note
Um aviso neutro.
:::

:::tip[Título customizado]
Com label.
:::

:::warning
Cuidado aqui.
:::
```

Renderiza um `<blockquote class="admonition bdm-<tipo>">`. Também aceita a sintaxe GitHub:

```markdown
> [!NOTE]
> Convertido automaticamente via `remark-github-admonitions-to-directives`.

> [!TIP]
> Funciona.
```

### 5.2 GitHub Card

Cartão com stars/forks/descrição puxados da API:

```markdown
::github{repo="owner/repo"}
```

Requer `repo` no formato `owner/repo`. Sintaxe de bloco com conteúdo é inválida — tem que ser leaf directive.

---

## 6. Matemática (KaTeX)

Inline:
```markdown
A fórmula de Einstein é $E = mc^2$.
```

Bloco:
```markdown
$$
BMR = (10 \times Peso) + (6.25 \times Altura) - (5 \times Idade) + 5
$$
```

Processado por `remark-math` + `rehype-katex`. CSS já incluído no Layout.

---

## 7. Blocos de código (Expressive Code)

### 7.1 Básico com título/linha destacada

```ts title="calc.ts" {3-5} ins={7} del={9}
function bmr(peso: number, altura: number, idade: number) {
  // linhas 3-5 destacadas
  const base = 10 * peso + 6.25 * altura;
  const extra = 5 * idade;
  return base - extra;
}
// linha 7 adicionada (+ verde)
// linha 9 removida (- vermelho)
```

Metadados disponíveis:
- `title="..."` — título da "aba" do editor
- `{N-M}` — destacar linhas
- `ins={N}` / `del={N}` — marcar como inserido/removido
- `showLineNumbers` / `showLineNumbers=false`
- `collapse={N-M}` — seções recolhíveis (pluginCollapsibleSections)

### 7.2 Terminal
Use a linguagem `shellsession` — aparece estilizado como terminal, sem números de linha:

````markdown
```shellsession
$ pnpm install
$ pnpm dev
```
````

### 7.3 Número de linhas e cópia
- Cada bloco ganha **botão de cópia customizado** (`pluginCustomCopyButton`)
- Cada bloco ganha **badge da linguagem** (`pluginLanguageBadge`)
- Linguagens suportadas: todas do Shiki

---

## 8. Imagens

### 8.1 Em posts
Caminho relativo a partir do arquivo `.md`:

```markdown
![alt](../images/foo.webp)
```

Todas as imagens ganham **lazy loading** automático via `rehype-lazy-media`. Clicar abre no PhotoSwipe (lightbox).

### 8.2 No frontmatter (`image`)
Mesmo caminho relativo. Usa o `ImageWrapper` — Astro + Sharp otimizam e servem WebP/AVIF no build.

### 8.3 Formatos recomendados
- `.webp` — primeira escolha (usado no `cat.webp`)
- `.jpg` — fotos com pouco detalhe sensível a compressão
- `.png` — só se precisar de transparência
- **Evite** PNG grande para banners/capas — vira MB desnecessários (ver `ISSUES.md`)

---

## 9. Auto-anchor em headings

Todo `##`, `###`, etc. ganha:
- `id` baseado no texto (`rehype-slug`)
- Âncora `#` ao lado no hover (`rehype-autolink-headings`)
- TOC gerado automaticamente se `siteConfig.toc.enable` for `true`

Profundidade do TOC controlada por `siteConfig.toc.depth` (1-4) em `src/config.ts`.

---

## 10. Campos do Astro não usados pelo schema (mas suportados pelo MDX)

- `layout` — MDX pode definir layout custom, mas não é usado (o layout é fixo em `[...slug].astro`)
- `permalink`, `slug` — Astro calcula automaticamente pelo caminho

---

## Cheat sheet

```markdown
---
title: "..."              # obrigatório
published: 2026-04-16     # obrigatório
category: "..."           # obrigatório
updated: 2026-04-17
description: "..."
image: "../images/x.webp"
tags: ["a", "b"]
draft: false
---

## Heading (gera âncora + entra no TOC)

Texto normal com $inline math$ e **negrito**.

$$
block = math
$$

:::tip[Dica importante]
Bloco especial.
:::

::github{repo="astro/astro"}

```ts title="ex.ts" {2-3}
const x = 1
const y = 2
const z = x + y
```
```
