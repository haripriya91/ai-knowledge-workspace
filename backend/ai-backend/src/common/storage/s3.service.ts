import { Injectable } from '@nestjs/common';
import { s3 } from '../../config/aws.config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private bucket = process.env.AWS_S3_BUCKET!;

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const safeName = file.originalname.replace(/\s+/g, '_');

    const key = `assets/${randomUUID()}-${safeName}`;
    await s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: 60 * 5,
    });
  }

  async deleteFile(key: string): Promise<void> {
    await s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();
  }

  async getObject(key: string): Promise<AWS.S3.GetObjectOutput> {
    return s3
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();
  }
}
