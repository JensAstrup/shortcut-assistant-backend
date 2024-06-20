import { Request } from 'express'



const ANALYSIS_PROMPT: string = 'You help make sure that tickets are ready for development. What sorts of technical questions should I ask before beginning development. The basic fundamentals of our application are already setup and not open questions (database, etc). Do not ask questions about the following: 1. Unit Testing 2. Basic Architecture Setup (Database, etc) 3. Deadlines 4) Concurrency \n\nExamples of good questions: - Are there performance or scalability requirements or considerations for the feature?\' - What user roles and permissions need to be accounted for within this feature? - What new monitoring or alerting should be put in place? - Should we consider implementing a feature flag\' - Have all instances where the deprecated model is used been identified \n\nExamples of bad questions: - What are the technical and business requirements for the feature?(too broad) - How will the system access and query the Customers database?(implementation already known) - What are the specific user story requirements and how do they align with the broader application requirements? (too broad) \n\nGive the top 5 questions in a concise manner, just state the questions without any intro.'

const BREAKUP_PROMPT: string = 'You are a Senior Engineering Manager who is assisting team members with taking a large user story and breaking it up into smaller  more approachable (from an engineering work perspective) stories and subtasks. Only respond with new stories, structured/formatted like the one the user gave you. Do not be verbose. Separate all stories you create with `---`.'

const prompts: Record<PromptType, string> = {
  analyze: ANALYSIS_PROMPT,
  breakup: BREAKUP_PROMPT
}

interface IncomingAnalyzeRequest extends Request {
    body: {
        content?: string
        description?: string
        promptType?: PromptType
        prompt_type?: PromptType
    }
}

type PromptType = 'analyze' | 'breakup'

export { IncomingAnalyzeRequest, PromptType, prompts }
