# victory_dev | Soluções Digitais

Landing page profissional para captação de leads, com formulário de agendamento integrado a banco de dados, chatbot interativo e servidor Node.js + MongoDB Atlas no back-end.

---

## 🖥️ Visual

> Adicione aqui um screenshot ou GIF da sua landing page em funcionamento.
> Sugestão: use o [ScreenToGif](https://www.screentogif.com/) para gravar um GIF da página.

```
[<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/966a886d-b4c0-47dc-91f9-e6532b79f190" />
 ]
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/2aed2b82-cfa4-4093-ab70-bdeda40f910a" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/c246b9cb-4ad7-42d9-9089-bb12ee41a608" />


```

---

## 🚀 Tecnologias

**Front-end**

- HTML5
- CSS3
- JavaScript (Vanilla)

**Back-end**

- Node.js
- Express.js
- Mongoose

**Banco de Dados**

- MongoDB Atlas

**Deploy**

- Netlify (front-end)
- Render (servidor)

---

## ⚙️ Instalação e Uso

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)
- Git instalado

### 1. Clone o repositório

```bash
git clone https://github.com/victorylesson/landing_page_victory_dev_servi-os_profissional-.git
cd landing_page_victory_dev_servi-os_profissional-
```

### 2. Configure o servidor

```bash
cd server
npm install
```

Crie um arquivo `.env` dentro da pasta `server/` com sua connection string do MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/victory_dev
```

> ⚠️ Nunca suba o arquivo `.env` para o GitHub. Ele já está no `.gitignore`.

### 3. Suba o servidor

```bash
npm start
```

O servidor vai rodar em `http://localhost:3000`.

### 4. Abra o front-end

Abra o arquivo `index.html` no navegador **ou** acesse via `http://localhost:3000` se o servidor estiver servindo os arquivos estáticos.

---

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página principal
├── style.css           # Estilos
├── script.js           # Lógica do front-end
├── favicon.png         # Ícone do site
├── server/
│   ├── server.js       # Servidor Express
│   ├── models/
│   │   └── Lead.js     # Model do MongoDB
│   ├── package.json
│   └── .env            # Variáveis de ambiente (não sobe pro Git)
└── README.md
```

---

## 🌐 Deploy

O front-end está hospedado no **Vercel** com deploy automático a partir da branch `main`.

O back-end está hospedado no **Render** em:

```
https://victory-dev-server.onrender.com
```

Toda vez que você fizer `git push` na branch `main`, o Netlify atualiza o site automaticamente.

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature:

```bash
git checkout -b minha-feature
```

3. Faça suas alterações e commit:

```bash
git commit -m "feat: minha nova feature"
```

4. Envie para o seu fork:

```bash
git push origin minha-feature
```

5. Abra um **Pull Request** explicando o que foi alterado.

---

## 📬 Contato

Feito por **Victory de Oliveira**

- 📧 victorymendestech@hotmail.com
- 📱 (81) 9 9148-2982
- 🌐 [victory-dev.vercel.app/] https://victory-dev.vercel.app/
- 📷 Instagram: [@victory_dev](https://instagram.com/victory_dev)
