import { findComments, createComment, deleteComment, findReplyComments } from '@/services/comment';
import { uploadImage } from '@/lib/uploadFile';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { slug } = await params;
  const tokenId = slug[0];
  const commentReplyId = slug[1];
  const searchParams = req.nextUrl.searchParams;
  const take = Number(searchParams.get('take')) || 10;
  const skip = Number(searchParams.get('skip')) || 0;

  try {
    // if (commentReplyId) {
    //   const replyComments = await findReplyComments(commentReplyId, skip, take);
    //   return NextResponse.json(replyComments);
    // }
    const [total, comments] = await findComments(tokenId, skip, take);
    return NextResponse.json({
      data: comments,
      total
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { slug } = await params;
  const tokenId = slug[0];
  const replyToId = slug[1];
  const formData = await req.formData();
  const userId = formData.get('userId');
  const text = formData.get('text');
  const image = formData.get('image');
  const imageName = formData.get('imageName');

  try {
    let imageUrl = null;
    if (image) {
      const pathArr = ['comments', tokenId, replyToId, imageName];
      const filePath = pathArr.filter(p => !!p).join('/');
      console.log(filePath);
      const { data, error } = await uploadImage(`/${filePath}`, image);
      if (error) {
        console.log(error);
        throw new Error(error);
      }
      imageUrl = data.fullPath;
    }

    const data = {
      tokenId,
      userId,
      text,
      image: imageUrl
    };
    if (replyToId) {
      data.replyToId = replyToId;
    }
    const newComment = await createComment(data);

    return NextResponse.json(newComment);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  const commentId = slug[0];
  const { userId } = await req.json();

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
  }

  try {
    await deleteComment(commentId, userId);
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}


