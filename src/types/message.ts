import type { Message } from "@/db/schema";
import React from "react";

type OmittedContentMessage = Omit<Message, 'content'>;

type ExtendedContent = {
  content: string | React.JSX.Element;
}

export type ExtendedMessage = OmittedContentMessage & ExtendedContent;