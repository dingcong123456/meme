import prisma from '@/lib/prisma';

export const findUser = (address) => {
  return prisma.user.findUnique({
    where: { address }
  });
}

export const createUser = (data) => {
  return prisma.user.create({data});
}

export const updateUser = (userId, data) => {
  return prisma.user.update({
    where: { userId },
    data
  });
}

export const findUserList = () => {
  return prisma.user.findMany();
}
