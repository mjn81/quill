import type { FC } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  disabled?: boolean;
}

const ChatInput: FC<ChatInputProps> = ({disabled=false}) => {
  return (
		<div className="absolute bottom-0 left-0 w-full">
			<div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
				<div className="relative flex h-full flex-1 items-stretch md:flex-col">
					<div className="relative flex flex-col w-full flex-grow p-4">
						<div className="relative">
							<Textarea
								rows={1}
								maxRows={4}
								autoFocus
								className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch"
								placeholder="Enter your question..."
              />
              
              <Button className='absolute bottom-1.5 right-1.5' aria-label='send message'>
                <Send className='w-4 h-4' />
              </Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatInput;