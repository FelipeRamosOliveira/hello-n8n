# hello-n8n · Zeca (PizzaCode) — LAB 365 / SENAI

Site estático de chat, usado como demo de aula do curso **IA para DEVs** (LAB 365 / SENAI).
É o front-end de um assistente de atendimento fictício, o **Zeca**, da pizzaria **PizzaCode**,
que conversa com um agente de IA hospedado no **n8n**, usando o **widget oficial `@n8n/chat`**
carregado via CDN (jsDelivr).

100% HTML + CSS + JavaScript puro — sem backend próprio, sem build, sem chave de API no
front-end, pronto para publicar como **Static Site** no Render (ou qualquer host estático).

## Arquivos

- `index.html` — página, container do widget e a chamada `createChat(...)`.
- `style.css` — identidade visual LAB 365 (cores, tipografia, layout) e overrides das
  CSS custom properties do widget `@n8n/chat`.
- `render.yaml` — deploy automático opcional no Render.

> Se você mantiver um `cardapio.json` na raiz do repo (dados usados pelo agente n8n),
> ele não é lido pelo front-end — sirva apenas de referência/fonte para o workflow.

## 1. Configurar a `WEBHOOK_URL`

Abra `index.html` e edite a constante `WEBHOOK_URL`, dentro do `<script type="module">`
no final do arquivo:

```js
// Troque aqui pela Production URL do webhook de chat do seu workflow n8n
const WEBHOOK_URL = 'https://SEU-N8N/webhook/SEU-ID/chat';
```

Use a **Production URL** do nó de chat do workflow (não a "Test URL").

## 2. Configuração necessária no n8n

Para o widget conversar com o workflow, no n8n:

1. No nó de chat do workflow, ative **"Make Chat Publicly Available"** com o modo
   **"Embedded"** (é o que permite embutir o widget num site externo).
2. Em **Allowed Origins (CORS)**, defina `*` (mais simples para demo/aula) ou a URL exata
   do site publicado (ex.: `https://hello-n8n.onrender.com`).
3. O workflow precisa estar **Publicado/Ativo** — com o editor salvo mas o workflow
   desativado, o webhook não responde.
4. **Atenção ao trial do n8n Cloud:** o plano de teste expira em **14 dias**; passado esse
   prazo a instância para e o `WEBHOOK_URL` deixa de responder (o chat mostra erro de rede).
   Se isso acontecer durante a aula, é preciso reativar/assinar a instância n8n ou apontar
   para uma nova.

## 3. Testar localmente

Não precisa de build. Como a página importa o widget via `<script type="module">` e CDN,
o mais confiável é servir por HTTP (alguns navegadores restringem ES modules em `file://`):

```bash
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

Abrir `index.html` direto com duplo-clique também costuma funcionar na maioria dos
navegadores modernos, mas prefira o passo acima se o widget não carregar.

## 4. Publicar no Render (Static Site)

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

## Sobre

Demo educacional do curso **IA para DEVs** — LAB 365 / SENAI. Não processa pedidos
reais nem armazena dados de clientes. A Chat URL usada no código é o endpoint público
de chat do workflow (não é uma chave secreta), por isso pode ficar versionada.
