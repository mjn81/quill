import { db } from "@/db";
import { and, eq } from "drizzle-orm";

export const getUserFiles = async (userId: string) => {
  const userFiles = await db.query.files.findMany({
		where: (file) => eq(file.userId, userId),
	});
  return userFiles;
}

export const getUserFileById = async (fileId: string, userId:string) => {
  const file = await db.query.files.findFirst({
    where: (file) => and(eq(file.id, fileId), eq(file.userId, userId)),
  });
  return file;
}