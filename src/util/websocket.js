import { useEffect, useRef, useState } from 'react';

function useWebSocket(url) {
  const ws = useRef(null);
  const eventMap = useRef(new Map());
  const [isConnect, setIsConnect] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    ws.current = new WebSocket(url);

    ws.current.onopen = function open() {
      console.log('WebSocket connection established');
      // ws.current.send(JSON.stringify({ event: 'message', data: 'Hello from the client!' }));
      setIsConnect(true);
    };

    ws.current.onmessage = function incoming(event) {
      const parsedData = JSON.parse(event.data);
      const handlers = eventMap.current.get(parsedData.event) || [];
      handlers.forEach(handler => handler(parsedData.data));
    };

    ws.current.onclose = function close() {
      setIsConnect(false);
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = function error(err) {
      setIsConnect(false);
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.current.close();
    };
  }, [url]);

  const onSocket = (event, handler) => {
    if (!eventMap.current.has(event)) {
      eventMap.current.set(event, []);
    }
    eventMap.current.get(event).push(handler);
  };

  const offSocket = (event, handler) => {
    if (!eventMap.current.has(event)) {
      return;
    }
    if (handler) {
      const handlers = eventMap.current.get(event);
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    } else {
      eventMap.current.delete(event);
    }
  };

  const sendMessage = (event, data) => {
    if (!ws.current || !isConnect) {
      return;
    }
    if (ws.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not open. Message not sent.');
      return;
    }
    ws.current?.send(JSON.stringify({ event, data }));
  }

  return { onSocket, offSocket, sendMessage };
}

export default useWebSocket;


