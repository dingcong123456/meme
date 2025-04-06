const express = require('express');
const { createServer } = require('http');
const { Server } = require('ws');
const {findPriceStatistics} = require("./src/services/price.js");
require('dotenv').config();

const app = express();
const server = createServer(app);
const wss = new Server({ server });
const userConnections = new Map();
const userInterval = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    console.error('用户 ID 未提供');
    ws.close();
    return;
  }
  userConnections.set(userId, ws);

  ws.on('message', (message) => {
    console.log('received: %s', message);
    const msg = JSON.parse(message);
    if (msg.type === 'chart') {
      const { tokenAddress, startTime, endTime } = msg.data
      sendPeriodicMessages(userId, tokenAddress, startTime, endTime);
      if (userInterval.has(userId)) {
        clearInterval(userInterval.get(userId));
      }
      userInterval.set(userId, setInterval(() => {
        sendPeriodicMessages(userId, tokenAddress, startTime, endTime);
      }, 3000))
    }
  });

  ws.on('close', () => {
    console.log(`用户 ${userId} 已断开连接`);
    clearInterval(userInterval.get(userId));
    userConnections.delete(userId); // 从映射表中移除
    userInterval.delete(userId); // 从映射表中移除
  });
});

server.listen(8100, () => {
  console.log('Server started on port 8100');
});

async function sendPeriodicMessages(targetUserId, tokenAddress, startTime, endTime) {
  if (userConnections.has(targetUserId)) {
    const ws = userConnections.get(targetUserId);
    const res = await findPriceStatistics(tokenAddress, new Date(startTime), new Date(endTime));
    const data = res.map((item) => {
      return {
        time: item.timestamp,
        open: item.startPrice.toString(),
        high: item.maxPrice.toString(),
        low: item.minPrice.toString(),
        close: item.endPrice.toString(),
      };
    });
    ws.send(JSON.stringify(data));
  }
}