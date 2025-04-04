import prisma from '@/lib/prisma';

export async function getCommentsCount(tokenId) {
  return await prisma.comment.count({
    where: {
      tokenId,
    },
  });
}

export async function findComments(tokenId, skip, take = 10) {
  return Promise.all([
    await prisma.comment.count({
      where: {
        tokenId
      }
    }),
    await prisma.comment.findMany({
      where: {
        tokenId,
      },
      include: {
        user: true,
        // _count: {
        //   select: { replyComments: true },
        // }
      },
      take,
      skip,
      orderBy: {
        createTime: 'desc',
      },
    })
  ]);
}

export async function findReplyComments(commentId, skip, take = 10) {
  return await prisma.comment.findMany({
    where: {
      replyCommentId: commentId,
    },
    include: {
      user: true,
      _count: {
        select: { replyComments: true },
      }
    },
    take,
    skip,
    orderBy: {
      createTime: 'desc',
    },
  });
}

export async function createComment(data) {
  return await prisma.comment.create({ data });
}

export async function deleteComment(commentId, userId) {
  const comment = await prisma.comment.findUnique({
    where: { commentId },
  });

  if (!comment || comment.userId !== userId) {
    throw new Error('Unauthorized or comment not found');
  }

  return await prisma.comment.delete({
    where: {
      commentId,
    },
  });
}