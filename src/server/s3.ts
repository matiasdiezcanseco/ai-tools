import "server-only";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const signUrl = async ({ url }: { url: string }) => {
  if (!url) {
    throw new Error("Invalid URL to sign");
  }

  const objectId = url.split("/").pop()!;

  const clientUrl = await createPresignedUrlWithClient({
    bucket: env.AWS_BUCKET_NAME,
    key: objectId,
  });

  return clientUrl;
};

const createPresignedUrlWithClient = ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const uploadFile = async ({ file }: { file: File }) => {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const fileName = Date.now() + "-" + file.name;

  const fileBuffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: fileName,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    Body: fileBuffer as any,
  });

  const response = await client.send(command);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error("Failed to upload file");
  }

  return `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
};
