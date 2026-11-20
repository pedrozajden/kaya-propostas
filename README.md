# Kayá · propostas

Código do projeto `proposta` da Vercel. É um site estático, sem build: os arquivos deste repositório são publicados como estão.

Endereços:
- https://proposta.kayamarketing.com.br
- https://kayamarketing.com.br (o `vercel.json` manda a raiz desse domínio para `/blackfriday`)

## Pastas

| Pasta | O que é |
|---|---|
| `index.html` | Página neutra da raiz de proposta.kayamarketing.com.br |
| `blackfriday/` | Página de vendas Black Kayá 2026 (até 30/11/2026) |
| `servicos/` | Versão da Black para prestadores de serviço (kayamarketing.com.br/servicos). Usa CSS, imagens e `config.js` de `blackfriday/` |
| `clinicas/` | Versão da Black para clínicas (kayamarketing.com.br/clinicas). Usa o `main.js` de `servicos/` |
| `guara-mirim/` | Proposta Jardim Guará Mirim (página + PDF) |
| `miguel-arcanjo/` | Proposta Escola Miguel Arcanjo (página + PDF) |
| `vercel.json` | URLs limpas, redirecionamentos do domínio e `noindex` em tudo |

## Black Kayá: o que dá para mudar sem mexer no resto

Tudo fica em `blackfriday/config.js`:
- `vagasPlano` e `vagasSites`: vagas que restam (atualizar a cada fechamento)
- `whatsapp`: número que recebe as conversas
- `pixel`: pixel do Meta
- `videos`: lista de vídeos do portfólio (arquivos em `blackfriday/video/`)

## Importante

Este repositório tem tudo o que está publicado no projeto `proposta`. Um deploy feito a partir de outra pasta substitui o projeto inteiro e pode apagar as outras propostas. Publique sempre a partir daqui.

Origem: arquivos baixados do deploy de produção de 16/11/2026 (23h43), porque a pasta original (`_SITES/BLACK KAYA 2026/_CODIGO DO SITE`) ficou no computador.
