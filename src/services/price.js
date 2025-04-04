import prisma from '@/lib/prisma';

async function findPriceStatistics(tokenAddress, startTime, endTime) {
  console.log(tokenAddress, startTime, endTime);
  return await prisma.priceStatistics.findMany({
    where: {
      tokenAddress,
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
}

// 导出函数
export { findPriceStatistics };

