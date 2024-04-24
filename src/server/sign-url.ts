import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

export const signUrl = async ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  const clientUrl = await createPresignedUrlWithClient({
    region: "us-east-1",
    bucket: bucket,
    key: key,
  });

  return clientUrl;
};

const createPresignedUrlWithClient = ({
  region,
  bucket,
  key,
}: {
  region: string;
  bucket: string;
  key: string;
}) => {
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
