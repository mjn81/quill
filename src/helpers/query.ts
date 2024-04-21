import { INFINITE_QUERY_LIMIT } from "@/constants/infinite-query";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { and, desc, eq, gt } from "drizzle-orm";

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

export const getHistoryMessages = async (fileId: string, limit?: number, cursor?: number) => {
  
  const rowLimit = (limit || INFINITE_QUERY_LIMIT) + 1;
  const userMessages = await db
		.select()
		.from(messages)
		.where(cursor ? gt(messages.id, cursor) : undefined)
		.limit(rowLimit)
    .orderBy(desc(messages.id));
  let nextCursor = undefined;

  if (userMessages.length > rowLimit) {
    const nextItem = userMessages.pop();
    nextCursor = nextItem?.id;
  }
  return {
    messages: userMessages,
    nextCursor,
  };
}