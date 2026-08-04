# hello-n8n · Zeca (PizzaCode) — LAB 365 / SENAI

Site estático de chat, usado como demo de aula do curso **IA para DEVs** (LAB 365 / SENAI).
É o front-end de um assistente de atendimento fictício, o **Zeca**, da pizzaria **PizzaCode**,
que conversa com um agente de IA hospedado no **n8n** através de um webhook.

100% HTML + CSS + JavaScript puro — sem backend próprio, sem chave de API no front-end,
pronto para publicar como **Static Site** no Render (ou qualquer host estático).

## Arquivos

- `index.html` — estrutura da página e do chat.
- `style.css` — identidade visual LAB 365 (cores, tipografia, dark mode, responsivo).
- `config.js` — **único lugar obrigatório** para configurar a URL do webhook do n8n.
- `app.js` — lógica do chat (envio, recebimento, erros, tema, chips).
- `render.yaml` — deploy automático opcional no Render.

## 1. Configurar a `WEBHOOK_URL`

Abra `config.js` e troque o placeholder pela **Production URL** do nó Webhook do seu
workflow n8n (não a "Test URL"):

```js
window.WEBHOOK_URL = "https://sua-instancia.app.n8n.cloud/webhook/chat";
```

Alternativa rápida para testar sem editar arquivo: no site, clique no ícone ⚙️ no
cabeçalho do chat, cole a URL e clique em "Salvar". Essa URL fica guardada só no seu
navegador (`localStorage`) e tem prioridade sobre a do `config.js` — útil em aula, mas
opcional.

### Contrato esperado do webhook

- **Requisição:** `POST` com header `Content-Type: application/json` e corpo:
  ```json
  { "mensagem": "texto digitado pelo usuário" }
  ```
- **Resposta:** aceita **texto puro** ou **JSON** no formato:
  ```json
  { "resposta": "texto de volta do agente" }
  ```
  (também são aceitos os campos `output` ou `text` como alternativa a `resposta`).
- Erros HTTP (4xx/5xx) e falhas de rede/CORS são tratados e exibidos de forma amigável
  no próprio chat.

## 2. Testar localmente

Não precisa de servidor nem de build: é só abrir o arquivo direto no navegador.

```bash
open index.html   # macOS
# ou dê duplo-clique no arquivo no Finder/Explorer
```

Se preferir servir por HTTP (opcional, mas evita eventuais bloqueios de `file://` em
alguns navegadores):

```bash
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

## 3. Publicar no Render (Static Site)

1. Suba este projeto para um repositório no GitHub.
2. No [Render](https://render.com), clique em **New +** → **Static Site**.
3. Conecte o repositório.
4. Configure:
   - **Build Command:** deixe vazio.
   - **Publish Directory:** `.`
5. Clique em **Create Static Site**. Pronto — o Render publica `index.html`
   automaticamente a cada push.

Se preferir, use o `render.yaml` incluso (Render detecta e aplica a configuração
automaticamente ao conectar o repositório com "Blueprint").

## 4. Nota importante sobre CORS

Como o site chama o webhook diretamente do navegador, o n8n precisa permitir a origem
do Render. No nó **Webhook** do seu workflow:

1. Abra as opções do nó → **Allowed Origins (CORS)**.
2. Defina como `*` (qualquer origem — mais simples para demo/aula) ou, para restringir,
   coloque a URL exata do seu site no Render (ex.: `https://hello-n8n.onrender.com`).
3. **Salve e republique o workflow** (a alteração só vale depois de reativar/publicar).

Se aparecer erro de rede/CORS no chat, esse é o primeiro lugar a conferir.

## Sobre

Demo educacional do curso **IA para DEVs** — LAB 365 / SENAI. Não processa pedidos
reais nem armazena dados de clientes.
