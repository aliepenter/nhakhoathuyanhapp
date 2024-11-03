import { SERVER_URI } from '@/utils/uri';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(SERVER_URI, { transports: ['websocket'], autoConnect: false });
    socketIo.connect();
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};
