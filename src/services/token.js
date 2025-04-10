import { getTokenMarket } from '@/app/api/token/route';
import prisma from '@/lib/prisma';

export const findToken = async(tokenId) => {
  try {
    const token = await prisma.token.findUnique({
      where: { tokenId },
      select: {
        tokenId: true,
        name: true,
        ticker: true,
        address: true,
        description: true,
        bondAddress: true,
        createTime: true,
        telegram: true,
        weblink: true,
        twitter: true,
        image: true,
        user: {
          select: {
            username: true,
            userId: true,
            address: true
          }
        }
      }
    });
    const marketCap = await getTokenMarket(token);
    return {
      ...token,
      marketCap
    };
  } catch {
    return null;
  }
}

export const findTokenByTicker = (ticker) => {
  return prisma.token.findFirst({
    where: { ticker }
  });
}

export const createToken = (data) => {
  return prisma.token.create({data});
}

export const updateToken = (tokenId, data) => {
  return prisma.token.update({
    where: { tokenId },
    data
  });
}

export const findTokenList = async ({pageNo = 1, keyword, address}) => {
  const queryObj = {};
  if (address) {
    queryObj.from = address;
  }
  if (keyword) {
    queryObj.OR = [
      {
        name: {
          contains: keyword
        }
      },
      {
        ticker: {
          contains: keyword
        }
      }
    ];
  }
  return Promise.all([
    await prisma.token.count({
      where: queryObj
    }),
    await prisma.token.findMany({
      select: {
        createTime: true,
        description: true,
        address: true,
        bondAddress: true,
        name: true,
        ticker: true,
        tokenId: true,
        image: true,
        user: {
          select: {
            username: true,
            userId: true,
            address: true
          }
        }
      },
      skip: (pageNo - 1) * 20,
      take: 20,
      where: queryObj
    })
  ]);
}

export const remoteToken = (tokenId) => {
  return prisma.token.delete({
    where: { tokenId }
  });
}

export const findHolders = async (tokenId) => {
  const users = await prisma.userToken.findMany({
    where: {
      tokenId,
    },
    include: {
      user: true, // 加载关联的 User 数据
    },
  });
  return users;
}
