import { INFINITE_QUERY_LIMIT } from "@/constants/infinite-query";
import { db } from "@/db";
import { Message, messages } from "@/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";

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

export type MessageHistory = {
  messages: Message[],
  nextCursor: number | undefined,
}

export const getHistoryMessages = async (fileId: string, limit?: number, cursor?: number): Promise<MessageHistory> => {
  
  const rowLimit = (limit || INFINITE_QUERY_LIMIT) + 1;
  const userMessages = await db
		.select()
		.from(messages)
		.where(
			and(
				eq(
					messages.fileId,
					fileId,
        ),
        cursor ? lt(messages.id, cursor) : undefined
			)
		)
		.limit(rowLimit)
		.orderBy(desc(messages.id));
  let nextCursor = undefined;

  if (userMessages.length > INFINITE_QUERY_LIMIT) {
    const nextItem = userMessages.pop();
    nextCursor = nextItem?.id;
  }
  return {
    messages: userMessages,
    nextCursor,
  };
}