# Lideranças Empáticas – Sistema de Gerenciamento

## 📖 Descrição
Plataforma web desenvolvida em React e Node.js para auxiliar no gerenciamento de equipes acadêmicas em atividades extensionistas, permitindo login, cadastro de equipes, registro de atividades, definição de metas e relatórios semanais.

## 🚀 Deploy
- **Frontend (Vercel/Netlify):** https://seuprojeto.vercel.app  
- **Backend (Railway/Render):** https://suaapi.onrender.com  
- **Vídeo demonstrativo:** https://youtu.be/SEU_VIDEO  

## 🛠️ Como rodar localmente
### Frontend
```bash
cd ESC_Semestre2_PI > ESC > muu > muu
npm install
npm run dev  # Defina VITE_API_URL=http://localhost:3000


🗂️ Estrutura do projeto:

    ESC_Semestre2_PI/
    └── ESC/
        └── muu/
            └── muu/
                ├── public/
                ├── src/
                │   ├── assets/
                │   ├── components/
                │   │   ├── Monitoring/
                │   │   │   ├── CountdownTimer.jsx
                │   │   │   ├── Timeline.jsx
                │   │   │   └── StudentInput.jsx
                │   │   ├── Goals/
                │   │   │   ├── GoalsCalendar.jsx
                │   │   │   └── AdminGoalsView.jsx
                │   │   ├── Doacoes.jsx
                │   │   ├── Relatorios.jsx
                │   │   ├── Metas.jsx
                │   │   └── ...
                │   ├── services/
                │   │   └── api.js
                │   ├── App.jsx
                │   ├── main.jsx
                │   └── index.css
                ├── package.json
                └── vite.config.js

