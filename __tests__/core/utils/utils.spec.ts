import * as utils from '@/core/utils/utils.ts'

describe('httpToWs', () => {
  it('should handle http', () => {
    const wsEndpoint = utils.httpToWs('http://endpoint.com:3000')
    expect(wsEndpoint).toBe('ws://endpoint.com:3000')
  });

  it('should handle https', () => {
   const wsEndpoint = utils.httpToWs('https://endpoint.com:3000')
   expect(wsEndpoint).toBe('wss://endpoint.com:3000')
 });
});
