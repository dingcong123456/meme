import prisma from '@/lib/prisma';

export const getTransactionList = async ({ pageNo, tokenAddress }) => {
  if (!tokenAddress) {
    return [];
  }
  const queryObj = {
    tokenAddress
  };
  return Promise.all([
    await prisma.tokenTransaction.count({
      where: queryObj
    }),
    await prisma.tokenTransaction.findMany({
      where: queryObj,
      skip: (pageNo - 1) * 20,
      take: 20
    })
  ]);
};
