const express = require("express");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Dashboard do Sistema</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
        }

        body {
          background: #f4f6f8;
          color: #222;
          padding: 24px;
        }

        header {
          margin-bottom: 24px;
        }

        h1 {
          color: #1f2937;
          margin-bottom: 8px;
        }

        .subtitulo {
          color: #6b7280;
        }

        .dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .card {
          background: #ffffff;
          border: 1px solid #d9e2ec;
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .card h2 {
          font-size: 20px;
          color: #2563eb;
          margin-bottom: 14px;
        }

        .item {
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .label {
          font-weight: bold;
          color: #374151;
        }

        .valor {
          color: #111827;
        }

        .erro {
          background: #fee2e2;
          border: 1px solid #ef4444;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: none;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Dashboard do Sistema</h1>
        <p class="subtitulo">Monitoramento simples usando Node.js, Express e JavaScript puro.</p>
      </header>

      <div id="erro" class="erro">Nao foi possivel carregar os dados da API.</div>

      <main class="dashboard">
        <section class="card">
          <h2>Sistema</h2>
          <p class="item"><span class="label">Hostname:</span> <span id="hostname" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Sistema operacional:</span> <span id="plataforma" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Arquitetura:</span> <span id="arquitetura" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">CPU:</span> <span id="cpu" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Memoria total:</span> <span id="memoriaTotal" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Memoria livre:</span> <span id="memoriaLivre" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Uptime:</span> <span id="uptime" class="valor">Carregando...</span></p>
        </section>

        <section class="card">
          <h2>Ambiente</h2>
          <p class="item"><span class="label">Ambiente:</span> <span id="ambiente" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Porta:</span> <span id="porta" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Node.js:</span> <span id="versaoNode" class="valor">Carregando...</span></p>
        </section>

        <section class="card">
          <h2>Desempenho</h2>
          <p class="item"><span class="label">Uso de CPU:</span> <span id="usoCpu" class="valor">Carregando...</span></p>
          <p class="item"><span class="label">Uso de memoria:</span> <span id="usoMemoria" class="valor">Carregando...</span></p>
        </section>
      </main>

      <script>
        function formatarBytes(bytes) {
          const gigabytes = bytes / 1024 / 1024 / 1024;
          return gigabytes.toFixed(2) + " GB";
        }

        function formatarUptime(segundos) {
          const horas = Math.floor(segundos / 3600);
          const minutos = Math.floor((segundos % 3600) / 60);
          return horas + "h " + minutos + "min";
        }

        async function carregarDashboard() {
          try {
            const respostaSistema = await fetch("/sistema");
            const respostaAmbiente = await fetch("/ambiente");
            const respostaDesempenho = await fetch("/desempenho");

            const sistema = await respostaSistema.json();
            const ambiente = await respostaAmbiente.json();
            const desempenho = await respostaDesempenho.json();

            document.getElementById("hostname").textContent = sistema.hostname;
            document.getElementById("plataforma").textContent = sistema.plataforma;
            document.getElementById("arquitetura").textContent = sistema.arquitetura;
            document.getElementById("cpu").textContent = sistema.numeroDeCpus + " nucleos";
            document.getElementById("memoriaTotal").textContent = formatarBytes(sistema.memoriaTotal);
            document.getElementById("memoriaLivre").textContent = formatarBytes(sistema.memoriaLivre);
            document.getElementById("uptime").textContent = formatarUptime(sistema.uptime);

            document.getElementById("ambiente").textContent = ambiente.ambiente;
            document.getElementById("porta").textContent = ambiente.porta;
            document.getElementById("versaoNode").textContent = ambiente.versaoNode;

            document.getElementById("usoCpu").textContent = desempenho.usoCpu;
            document.getElementById("usoMemoria").textContent = desempenho.usoMemoria;
          } catch (erro) {
            document.getElementById("erro").style.display = "block";
          }
        }

        carregarDashboard();
      </script>
    </body>
    </html>
  `);
});

app.get("/sistema", (req, res) => {
  res.json({
    hostname: os.hostname(),
    plataforma: os.platform(),
    arquitetura: os.arch(),
    numeroDeCpus: os.cpus().length,
    memoriaTotal: os.totalmem(),
    memoriaLivre: os.freemem(),
    uptime: os.uptime(),
  });
});

app.get("/ambiente", (req, res) => {
  const estaNaRender = Boolean(process.env.RENDER);

  res.json({
    ambiente: estaNaRender ? "nuvem (Render)" : "local",
    porta: PORT,
    versaoNode: process.version,
  });
});

app.get("/desempenho", (req, res) => {
  const usoCpu = Math.floor(Math.random() * 101);
  const usoMemoria = Math.floor(Math.random() * 101);

  res.json({
    usoCpu: `${usoCpu}%`,
    usoMemoria: `${usoMemoria}%`,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
