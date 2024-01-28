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