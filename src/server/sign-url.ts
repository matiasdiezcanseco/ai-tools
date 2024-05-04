import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

export const signUrl = async ({ url }: { url: string }) => {
  if (!url) {
    return "";
  }

  const objectId = url.split("/").pop()!;

  const clientUrl = await createPresignedUrlWithClient({
    region: "us-east-1",
    bucket: env.AWS_BUCKET_NAME,
    key: objectId,
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
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};
