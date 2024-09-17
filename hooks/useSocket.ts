import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.123:3000';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, { transports: ['websocket'], autoConnect: false });
    socketIo.connect();
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};
