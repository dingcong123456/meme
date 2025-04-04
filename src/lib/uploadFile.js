import {supabase} from './supabase';

export const uploadFile = (bucketName, filePath, file) => {
  return supabase.storage.from(bucketName).upload(filePath, file);
}

export const uploadImage = (filePath, file) => {
  return uploadFile(process.env.IMAGE_BUCKET, filePath, file);
}