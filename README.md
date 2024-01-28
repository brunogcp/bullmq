<div align="center">
  <h3 align="center">BullMQ</h3>
  <div>
  <a href="https://bgcp.vercel.app/article/b079677b-0ba6-4ced-9b54-c120484552e8">
  <img src="https://img.shields.io/badge/Download PDF (ENGLISH)-black?style=for-the-badge&logoColor=white&color=000000" alt="three.js" />
  </a>
  </div>
</div>

## 🚀 Introdução ao BullMQ

BullMQ é uma biblioteca poderosa para o gerenciamento de filas de tarefas em Node.js, utilizando Redis como armazenamento. Ela é perfeita para operações assíncronas complexas e tarefas de background, como o processamento de filas de espera, com suporte a recursos avançados como atraso de tarefas, agendamentos e muito mais.

### 🌟 Principais Características:

- **⚡ Alto Desempenho**: Leva vantagem da velocidade e eficiência do Redis.
- **🔄 Flexibilidade**: Permite a criação de múltiplas filas com diferentes prioridades.
- **✔️ Durabilidade**: Assegura que as tarefas sejam mantidas seguras e reprocessadas em caso de falhas.
- **🔍 Monitoramento Avançado**: Vem com ferramentas para monitorar e administrar tarefas e filas.

## 🛠️ Instalação

### Windows, Linux (Ubuntu/Debian), e macOS:

A instalação do BullMQ é uniforme em todas as plataformas, exigindo apenas o Node.js e o Redis como pré-requisitos. Primeiro, certifique-se de que o Redis está instalado e operacional. Depois, instale o BullMQ usando NPM:

```bash
npm install bullmq
```
<div style="page-break-after: always;"></div>


## 📊 Uso Básico

### Configuração Inicial:

Antes de mergulhar nos exemplos, é crucial configurar o Redis e a biblioteca BullMQ. Aqui está um exemplo básico de configuração:

1. **Instalação do BullMQ**:

```bash
npm install bullmq
```

2. **Criação da Fila**:

Crie um arquivo `queue.js` para definir sua fila:

```js
const { Queue } = require('bullmq');
const myQueue = new Queue('myQueueName', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});
```

### Exemplo Básico:

Para ilustrar o uso do BullMQ, vejamos um exemplo simplificado de como adicionar e processar tarefas:

```js
const { Queue, Worker } = require('bullmq');

const connectionConfig = {
  connection: {
    host: 'localhost',
    port: 6379
  }
};

const myQueue = new Queue('myQueueName', connectionConfig);

async function addJobs() {
  await myQueue.add('myJob', { foo: 'bar' });
  console.log('Job adicionado');
}

addJobs();

const myWorker = new Worker('myQueueName', async job => {
  console.log(`Processando job: ${job.id}, com data: `, job.data);
}, connectionConfig);

```

## 📈 BullMQ para Gerenciamento de Fila de Espera

### Teoria do Gerenciamento de Fila de Espera:

💡 Utilizar o BullMQ para gerenciar filas de espera permite organizar o acesso a recursos limitados de forma eficiente, garantindo uma distribuição justa e ordenada.

### Motivo para Utilizar o BullMQ para Fila de Espera:

🚀 Implementar uma fila de espera com BullMQ ajuda a gerenciar o acesso concorrente a páginas ou serviços, melhorando a experiência do usuário e otimizando o uso de recursos.

### 👨‍💻 Implementação Fila de espera:
### Backend:

#### Configuração Inicial

1. **Instale as Dependências Necessárias**:

   No seu terminal, navegue até a pasta do seu projeto backend e execute:

   ```bash
   npm init -y
   npm install express bullmq ioredis cors
   ```

   Isso instalará o Express para o servidor web, BullMQ para o gerenciamento da fila, ioredis como cliente Redis, e cors para permitir requisições CORS do seu frontend React.

2. **Configure o Servidor Express e a Fila com BullMQ**:

   Crie um arquivo `server.js` para configurar seu servidor e a fila:

```javascript
const express = require('express');
const { Queue, Worker } = require('bullmq');
const cors = require('cors');

const connectionConfig = {
  connection: {
    host: 'localhost',
    port: 6379
  }
};

const queue = new Queue('accessQueue', { connection: connectionConfig });
const app = express();
app.use(cors());
app.use(express.json());

app.post('/request-access', async (req, res) => {
  const job = await queue.add('access', {}, { removeOnComplete: false, removeOnFail: true });
  res.json({ jobId: job.id, status: '🚀 Solicitação adicionada à fila!' });
});

app.post('/leave-queue', async (req, res) => {
  const job = await queue.getJob(req.body.jobId);
  if (job) {
    await job.remove();
    res.send('🚶‍♂️ Removido da fila!');
  } else {
    res.status(404).send('❌ Job não encontrado.');
  }
});

app.post('/simulate-users', async (req, res) => {
  for (let i = 0; i < 10; i++) {
    await queue.add('access', { user: `SimulatedUser${i}` }, { removeOnComplete: false, removeOnFail: true });
  }
  res.send('👥 10 usuários simulados adicionados à fila!');
});

app.get('/queue-position/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await queue.getJob(jobId);
    if (!job) {
      return res.status(404).send('Job não encontrado.');
    }
    const waitingJobs = await queue.getWaiting(); // Obtem uma lista de jobs esperando
    const position = waitingJobs.findIndex(j => j.id === jobId); // Encontra a posição baseada no ID
    const counts = await queue.getJobCounts('waiting', 'active');
    res.json({ position: position !== -1 ? position + 1 : -1, waiting: counts.waiting, active: counts.active });
  } catch (error) {
    res.status(500).send('Erro ao obter posição na fila: ' + error.message);
  }
});

const worker = new Worker('accessQueue', async (job) => {
  // Simula o processamento da fila com um delay
  console.log(`Iniciando processamento do job ${job.id}`);
  // Define um delay de 5000 ms (5 segundos) antes de concluir o processamento
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log(`Processamento do job ${job.id} concluído`);
}, connectionConfig);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

### Frontend: React

#### Setup do Projeto

1. **Crie um Novo Projeto React** (se ainda não tiver um):

```bash
npm create vite@latest
```

2. **Adicione o Axios para Facilitar as Requisições HTTP**:

```bash
npm install axios
```
<div style="page-break-after: always;"></div>


3. **Crie os Componentes React**:

   No diretório do seu projeto React, crie um novo componente `QueueManager.js`. Este componente incluirá os três botões solicitados e lógica para interagir com o backend.

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [jobId, setJobId] = useState('');
  const [message, setMessage] = useState('');
  const [isInQueue, setIsInQueue] = useState(false);
  const [position, setPosition] = useState(null);

  const requestAccess = async () => {
    const { data } = await axios.post('http://localhost:5000/request-access');
    setJobId(data.jobId);
    setIsInQueue(true);
    setMessage(data.status);
    setPosition(null)
  };

  const leaveQueue = async () => {
    if (jobId) {
      setIsInQueue(false);
      await axios.post('http://localhost:5000/leave-queue', { jobId });
      setMessage('🚶‍♂️ Você saiu da fila!');
      setPosition(null)
    }
  };

  const simulateUsers = async () => {
    await axios.post('http://localhost:5000/simulate-users');
    setMessage('👥 10 usuários simulados adicionados!');
  };

  useEffect(() => {
    if (!isInQueue) {
      setMessage('');
    }
  }, [isInQueue]);

  const updateQueuePosition = async () => {
    if (jobId) {
      try {
        const { data } = await axios.get(`http://localhost:5000/queue-position/${jobId}`);
        if (data.position !== -1) {
          if (data.position === 1) {
            setMessage('Você é o próximo! Prepare-se para acessar o sistema.');
            // Aqui, você pode definir o estado para mostrar novas opções ao usuário
          } else {
            setMessage(`Sua posição na fila é: ${data.position}. Aguardando: ${data.waiting}, Ativos: ${data.active}`);
          }
          setPosition(data.position);
        } else {
          setMessage('Processando sua solicitação...');
          setPosition(data.position);
        }
      } catch (error) {
        console.error('Erro ao atualizar posição na fila', error);
      }
    }
  };
  
  useEffect(() => {
    // Inicia o polling quando o usuário entra na fila
    const interval = isInQueue ? setInterval(() => {
      updateQueuePosition();
    }, 5000) : null;
    // Limpa o intervalo quando o componente desmonta ou o usuário sai da fila
    return () => clearInterval(interval);
  }, [isInQueue, jobId]);

  return (
    <div>
      <button onClick={requestAccess} disabled={isInQueue}>Solicitar Acesso</button>
      <button onClick={leaveQueue} disabled={!jobId || position === 1}>Sair da Fila</button>
      <button onClick={simulateUsers}>Simular Usuários</button>
      <p>{message}</p>
      {position === -1 && (
        // Renderize as opções ou informações adicionais para o usuário que está no início da fila
        <div>
          <p>Você agora pode acessar o sistema! Aqui estão suas opções:</p>
          {/* Exemplos de novas opções */}
          <button onClick={leaveQueue} disabled={!jobId || position === 1}>Sair</button>
        </div>
      )}
    </div>
  );
}

export default App;
```

4. Integre este componente no seu `App.js`.
<div style="page-break-after: always;"></div>


### 🔍 Testes

#### 1. Testar a Funcionalidade de "Solicitar Acesso"

- No frontend, clique no botão "Solicitar Acesso".
- Observe se uma mensagem indicando que você foi adicionado à fila é exibida (ex.: "🚀 Solicitação adicionada à fila!").
- Verifique se a aplicação exibe a posição atual na fila ou se permite acesso imediato ao conteúdo, dependendo de sua lógica de gerenciamento de filas.

#### 2. Testar a Funcionalidade de "Sair da Fila"

- Após solicitar acesso, clique no botão "Sair da Fila".
- Confirme se a mensagem indica que você foi removido da fila (ex.: "🚶‍♂️ Você saiu da fila!").
- Caso haja uma interface ou mensagem indicando sua posição na fila, essa informação deve desaparecer ou atualizar.

### 3. Testar a Funcionalidade de "Simular Usuários"

- Clique no botão "Simular Usuários" para adicionar 10 usuários simulados à fila.
- Verifique se uma mensagem confirmando a ação é exibida (ex.: "👥 10 usuários simulados adicionados!").
- Se o seu sistema permite visualizar a quantidade de usuários na fila, confira se o número aumentou conforme esperado.

## 🏆 Conclusão

Neste tutorial, abordamos como o BullMQ pode ser utilizado para criar uma fila de espera para o acesso a páginas, oferecendo uma solução eficaz para gerenciar o acesso concorrente. Através da combinação de BullMQ e Redis, é possível implementar sistemas robustos de gerenciamento de tarefas e filas de espera, melhorando a eficiência e a experiência do usuário em aplicações web. Continue explorando as possibilidades do BullMQ para otimizar suas aplicações Node.js. 🐂💼