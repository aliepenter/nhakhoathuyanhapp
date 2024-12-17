import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (SERVER_URI: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [cuocTroChuyenId, setCuocTroChuyenId] = useState<number>();

  useEffect(() => {
    const socketIo = io(SERVER_URI, { transports: ['websocket'], autoConnect: false });
    socketIo.connect();
    setSocket(socketIo);

    socketIo.on('message', (payload: Messages) => {
      setCuocTroChuyenId(payload.cuoc_tro_chuyen_id)
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [SERVER_URI]);

  return { messages, socket, cuocTroChuyenId };
};

export default useSocket;
