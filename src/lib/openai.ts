import OpenAI from "openai";

export const getOpenAIConfig = () => {
	const openAIApiKey = process.env.OPENAI_API_KEY;
	if (!openAIApiKey) {
		throw new Error('OpenAI API Key not found');
	}
	return {
		openAIApiKey,
	};
};


export const openai = new OpenAI({
	apiKey: getOpenAIConfig().openAIApiKey,
});