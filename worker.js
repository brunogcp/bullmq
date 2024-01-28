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

// Make sure to use the same queue name ('myQueueName') and include the connection configuration
const myWorker = new Worker('myQueueName', async job => {
  console.log(`Processando job: ${job.id}, com data: `, job.data);
}, connectionConfig);
