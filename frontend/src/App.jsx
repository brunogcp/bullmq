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
