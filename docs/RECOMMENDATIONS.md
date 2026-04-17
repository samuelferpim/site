# Recomendações de melhorias

Lista de ideias para evoluir o site. Separado por área e esforço estimado.

---

## 🚀 Performance

### 1. Usar AVIF/WebP como primary format nas imagens (esforço: baixo)
Astro já gera variantes, mas você pode forçar WebP/AVIF na config para garantir que o `<picture>` default sirva o formato moderno.

### 2. Lazy-load componentes React pesados (esforço: baixo)
`ScientificMacroCalc.jsx` é pesado e só aparece em posts específicos — já usa `client:visible`, bom. Considere `client:idle` para widgets acima da dobra que não são críticos.

### 3. Reduzir bundle Svelte do Archive e Search (esforço: médio)
`ArchivePanel.svelte` importa toda a lista de posts. Se você passar de ~100 posts, vale paginação client-side.

### 4. Pré-compilar favicons em SVG (esforço: baixo)
Hoje: `icon.png` 193 KB. Um SVG bem-feito fica em <5 KB e escala infinito. Use quando tiver um logo vetorial.

---

## 🔍 SEO

### 5. Adicionar `sitemap-index.xml` dedicado por locale (esforço: baixo)
Já existe via `@astrojs/sitemap` com i18n — conferir se o Google Search Console está pegando os dois idiomas.

### 6. Schema.org mais rico nos posts (esforço: médio)
`src/pages/posts/[...slug].astro` já emite `BlogPosting`. Adicionar `publisher`, `mainEntityOfPage` e `image` completaria a cobertura.

### 7. RSS separado por locale (esforço: baixo)
Hoje `/rss.xml` é só em EN (após a correção recente). Criar `/pt-BR/rss.xml` replicando `src/pages/rss.xml.ts` com `getSortedPostsForLang("pt-BR")` permitiria assinaturas no idioma.

### 8. OG image dinâmica por post (esforço: alto)
Gerar uma OG image com título do post sobre o banner via Satori/Sharp no build. Mais compartilhável no Twitter/LinkedIn.

---

## 🌐 Conteúdo & UX

### 9. Página de CV / Currículo (esforço: médio — ver seção dedicada abaixo)

### 10. Página `/uses/` ou `/stack/` (esforço: baixo)
Padrão popular em blogs de devs — lista de ferramentas/hardware/setup. Pode ser só um `spec/uses.md`.

### 11. "Now" page (esforço: baixo)
Inspirado em nownownow.com — uma página `/now/` dizendo no que está trabalhando agora.

### 12. Comentários habilitados por padrão (esforço: baixo)
`commentConfig.giscus` já está configurado. Confirmar se está aparecendo nos posts (o `comment/index.astro` roda automaticamente).

### 13. Newsletter / RSS por e-mail (esforço: médio)
Integrar Buttondown ou Kit (ConvertKit) via formulário simples. Um form Astro + endpoint de API resolve.

### 14. Dark mode como default ou respeitar system (esforço: baixo)
Hoje segue `DEFAULT_THEME` em `src/constants/constants.ts`. Se quiser mudar, é uma linha.

### 15. Reading progress bar (esforço: baixo)
Uma barra fina no topo indicando progresso de leitura do post. ~20 linhas de JS + CSS.

---

## 📝 Processo / DX

### 16. Preview de posts com data futura no dev (esforço: zero — já existe)
Já está implementado em `Layout.astro:applyScheduledPostVisibility`. Confirmar que está funcionando.

### 17. CI com `pnpm check` + `pnpm lint` (esforço: baixo)
Um `.github/workflows/ci.yml` rodando no push/PR para garantir que nada quebra antes do deploy.

### 18. Git hook pre-commit com biome (esforço: baixo)
Instalar `simple-git-hooks` + rodar `pnpm lint` automaticamente antes de commitar.

### 19. Script para otimizar imagens novas (esforço: baixo)
`scripts/optimize-image.js` aceitando path, gerando versão <500KB (WebP preferido). Evita que `cat.png` de 8 MB aconteça de novo.

---

## 🧹 Dívida técnica (não é urgente)

### 20. Remover código morto remanescente
- Linhas 380-421 de `Layout.astro` têm blocos comentados antigos (`disableAnimation`). Podem ser apagados.
- `src/pages/[lang]/[...page].astro` e outros pages têm imports redundantes (ainda saem como "hints" no `astro check`).

### 21. Refatorar `LanguageSwitch.svelte` para silenciar warning Svelte 5
```svelte
let { lang, ...props } = $props();
let currentLang = $state(lang || DEFAULT_LOCALE);
// usar `lang` em vez de `initialLang` nas demais referências
```

### 22. Mover strings hardcoded do Navbar/Footer para i18n
`Footer.astro:14` tem `"All Rights Reserved"` hardcoded em inglês. Criar `I18nKey.allRightsReserved`.

### 23. Colocar collection `portfolio` em hibernação enquanto estiver vazia
Hoje dá warning no dev: `[glob-loader] No files found matching ... in directory "src/content/portfolio"`. Comentar a collection em `src/content/config.ts` até ter conteúdo, ou adicionar um `_placeholder.md` (o pattern `!**/_*` exclui arquivos com prefixo `_`).

---

## 📄 Como adicionar uma seção de Currículo (passo a passo)

**Objetivo:** criar `/cv/` (e `/pt-BR/cv/`) com seu currículo, integrado ao menu, seguindo o mesmo padrão de About/Profile.

### Passo 1 — Criar as páginas

```
src/pages/cv.astro             # locale default (EN)
src/pages/[lang]/cv.astro      # outras locales
```

Copie `about.astro` e `[lang]/about.astro` como base, trocando:
- `getEntry("spec", "about")` → `getEntry("spec", "cv")`
- `I18nKey.about` → `I18nKey.cv`
- Path da alternate link: `/cv/`

### Passo 2 — Criar os conteúdos

```
src/content/spec/cv.md         # EN
src/content/spec/en/cv.md      # EN explícito (opcional)
src/content/spec/pt-BR/cv.md   # PT-BR
```

**Opções de conteúdo:**

**A) CV inline em Markdown** (mais flexível, indexado no Pagefind):
```markdown
# Currículo

## Experiência

### Desenvolvedor — CI&T
*2023 — presente*

- Projeto X
- Projeto Y

## Educação
...

## Skills
...

[Download PDF](/cv/samuel-pimentel.pdf)
```

**B) Link para PDF** (mais simples, menos indexável):
- Coloque o PDF em `public/cv/samuel-pimentel.pdf`
- Em `cv.md`: `[Baixar currículo em PDF](/cv/samuel-pimentel.pdf)`

**C) Híbrido** (recomendado): HTML resumido + link pro PDF completo.

### Passo 3 — Adicionar chave i18n

Em `src/i18n/i18nKey.ts`:
```ts
enum I18nKey {
  // ...
  cv = "cv",
}
```

Em `src/i18n/languages/en.ts`:
```ts
[Key.cv]: "CV",
```

Em `src/i18n/languages/pt.ts`:
```ts
[Key.cv]: "Currículo",
```

### Passo 4 — Adicionar ao menu

Em `src/types/config.ts`:
```ts
export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Portfolio = 3,
  CV = 4,
}
```

Em `src/constants/link-presets.ts`:
```ts
[LinkPreset.CV]: {
  name: i18n(I18nKey.cv),
  url: "/cv/",
},
```

Em `src/components/Navbar.astro` (bloco `presetKeys`):
```ts
[LinkPreset.CV]: I18nKey.cv,
```

Em `src/config.ts` (navBarConfig.links):
```ts
LinkPreset.CV,
```

### Passo 5 — Validar

```bash
pnpm check
pnpm dev
```

Acessar `/cv/` e `/pt-BR/cv/`.

---

> Quer que eu implemente a seção de CV agora? Posso criar as páginas + chave i18n + entrada no menu com um placeholder de conteúdo, deixando só pra você preencher.
