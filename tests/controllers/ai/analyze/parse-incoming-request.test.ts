import parseIncomingRequest from '@sb/controllers/ai/analyze/parse-incoming-request'
import { IncomingAnalyzeRequest, prompts } from '@sb/types/prompt-request'
import { logger } from '@sb/utils/logger'


jest.mock('@sb/utils/logger', () => ({
  logger: { info: jest.fn() }
}))


describe('parseIncomingRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if content is missing', () => {
    const req = { body: { promptType: 'test' } } as unknown as IncomingAnalyzeRequest
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    // @ts-expect-error req and res are mocked
    const result = parseIncomingRequest(req, res)
    expect(result).toBeUndefined()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Both content and promptType are required fields' })
  })

  it('should return undefined if promptType is missing', () => {
    const req = { body: { content: 'test' } } as unknown as IncomingAnalyzeRequest
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    // @ts-expect-error req and res are mocked
    const result = parseIncomingRequest(req, res)
    expect(result).toBeUndefined()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Both content and promptType are required fields' })
  })

  it('should return undefined if prompt type is invalid', () => {
    const req = { body: { content: 'test', promptType: 'invalid' } } as unknown as IncomingAnalyzeRequest
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    // @ts-expect-error req and res are mocked
    const result = parseIncomingRequest(req, res)
    expect(result).toBeUndefined()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid prompt type' })
  })

  it('should return content and prompt if prompt type is valid', () => {
    const req = { body: { content: 'test', promptType: 'analyze' } } as unknown as IncomingAnalyzeRequest
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    // @ts-expect-error req and res are mocked
    const result = parseIncomingRequest(req, res)
    expect(result).toEqual({ content: 'test', prompt: prompts.analyze })
    expect(logger.info).toHaveBeenCalledWith('Received request with prompt type analyze')
    expect(logger.info).toHaveBeenCalledWith('Parsed request with prompt type analyze')
  })
})
