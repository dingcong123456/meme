import prisma from '@/lib/prisma';

export async function createTransaction(params) {
  return await prisma.tokenTransaction.create({
    data: params
  });
}
