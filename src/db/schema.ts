import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	pgEnum,
	uuid,
	varchar,
	boolean,
	serial,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	})
);

export const fileUploadStatus = pgEnum("file_upload_status", [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);

export const files = pgTable('file', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	uploadStatus: fileUploadStatus('uploadStatus').notNull().default('PENDING'),
	mimetype: varchar('mimetype').notNull(),
	size: integer('size').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export type File = typeof files.$inferSelect;
// has cursor pagination
export const messages = pgTable('message', {
	id: serial('id').primaryKey(),
	content: text('content').notNull(),
	isUserMessage: boolean('is_user_message').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	fileId: uuid('fileId').notNull().references(() => files.id, { onDelete: 'cascade' }),
	userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export type Message = typeof messages.$inferSelect;