const { Queue } = require('bullmq');
const myQueue = new Queue('myQueueName', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});