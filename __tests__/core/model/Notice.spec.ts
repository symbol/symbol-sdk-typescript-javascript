import {NoticeType} from '@/core/model'
import {Notice} from '@/core/model/Notice.ts'

describe('Notice', () => {
 it('Should commit the right mutation to the store', () => {
  const commitMock = jest.fn()
  const store = {commit: commitMock}

  // @ts-ignore
  Notice.trigger('test message', NoticeType.success, store)

  expect(commitMock.mock.calls).toHaveLength(1)
  expect(commitMock.mock.calls[0][0]).toEqual('TRIGGER_NOTICE')
  // @ts-ignore
  expect(commitMock.mock.calls[0][1]).toEqual(new Notice('test message', NoticeType.success))
 })
})
