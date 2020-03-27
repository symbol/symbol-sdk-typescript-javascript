/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  FakeTable,
  FakeModel,
} from '@MOCKS/Database'
import {JSONFormatter} from '@/core/database/formatters/JSONFormatter'

// HELPERS
const getFormatter = (): JSONFormatter => {
  const formatter = new JSONFormatter()
  formatter.setSchema(new FakeTable('db_table', [
    'id',
    'db_column1',
    'db_column2',
    'db_column3',
  ]))

  return formatter
}

describe('database/AbstractFormatter ==>', () => {
  describe('setSchema() should', () => {
    test('update $schema property', () => {
      const formatter = new JSONFormatter()
      formatter.setSchema(new FakeTable('table', ['col1']))

      expect(formatter.getSchema()).toBeDefined()
      expect(formatter.getSchema().tableName).toBe('table')
      expect(formatter.getSchema().columns).toMatchObject(['col1'])
    })
  })
})

describe('database/JSONFormatter ==>', () => {
  describe('format() should', () => {
    test('return empty JSON object given no values', () => {
      // prepare
      const formatter = getFormatter()

      // act
      const json = formatter.format(new FakeTable('table', ['col1']), new Map<string, FakeModel>())
      expect(json).toBe('{}')
    })

    test('return correctly formatted JSON from single entry', () => {
      // prepare
      const formatter = getFormatter()

      // use "id" auto generation
      const model = new FakeModel(['id'], new Map<string, any>([
        [ 'db_column1', 'value1' ],
        [ 'db_column2', 'value2' ],
        [ 'db_column3', 'value3' ],
      ]))

      // act
      const expected = '{"' + model.getIdentifier() + '":{'
        + '"db_column1":"value1",'
        + '"db_column2":"value2",'
        + '"db_column3":"value3",'
        + '"id":"' + model.getIdentifier() + '",'
        + '"version":0'
        + '}}'
      const json = formatter.format(
        new FakeTable('table', ['col1']),
        new Map<string, FakeModel>([[ model.getIdentifier(), model ]]),
      )
      expect(json).toBe(expected)

      // make sure JSON is valid
      const parsed = JSON.parse(json)
      expect(parsed).toMatchObject(JSON.parse(expected))
    })

    test('return entries mapped by identifier in JSON', () => {
      // prepare
      const formatter = getFormatter()

      const model1 = new FakeModel(['id'], new Map<string, any>([
        [ 'db_column1', 'value1' ],
        [ 'db_column2', 'value2' ],
        [ 'db_column3', 'value3' ],
      ]))

      const model2 = new FakeModel(['id'], new Map<string, any>([
        [ 'db_column1', 'value1' ],
        [ 'db_column2', 'value2' ],
        [ 'db_column3', 'value3' ],
      ]))

      // act
      const json = formatter.format(
        new FakeTable('table', ['col1']),
        new Map<string, FakeModel>([
          [ model1.getIdentifier(), model1 ],
          [ model2.getIdentifier(), model2 ],
        ]))

      const parsed = JSON.parse(json)
      expect(parsed[model1.getIdentifier()]).toBeDefined()
      expect(parsed[model2.getIdentifier()]).toBeDefined()
    })

    test('return entries values in JSON', () => {
      // prepare
      const formatter = getFormatter()

      const model1 = new FakeModel(['id'], new Map<string, any>([
        [ 'db_column1', 'value1' ],
        [ 'db_column2', 'value2' ],
        [ 'db_column3', 'value3' ],
      ]))

      const model2 = new FakeModel(['id'], new Map<string, any>([
        [ 'db_column1', 'value1_2' ],
        [ 'db_column2', 'value2_2' ],
        [ 'db_column3', 'value3_2' ],
      ]))

      // act
      const json = formatter.format(
        new FakeTable('table', ['col1']),
        new Map<string, FakeModel>([
          [ model1.getIdentifier(), model1 ],
          [ model2.getIdentifier(), model2 ],
        ]))

      const parsed = JSON.parse(json)
      expect(Object.keys(parsed).length).toBe(2)

      // model 1
      expect(Object.keys(parsed[model1.getIdentifier()]).length).toBe(5)
      expect(parsed[model1.getIdentifier()].id).toBe(model1.getIdentifier())
      expect(parsed[model1.getIdentifier()].db_column1).toBe('value1')
      expect(parsed[model1.getIdentifier()].db_column2).toBe('value2')
      expect(parsed[model1.getIdentifier()].db_column3).toBe('value3')
      expect(parsed[model1.getIdentifier()].version).toBe(0)

      // model 2
      expect(Object.keys(parsed[model2.getIdentifier()]).length).toBe(5)
      expect(parsed[model2.getIdentifier()].id).toBe(model2.getIdentifier())
      expect(parsed[model2.getIdentifier()].db_column1).toBe('value1_2')
      expect(parsed[model2.getIdentifier()].db_column2).toBe('value2_2')
      expect(parsed[model2.getIdentifier()].db_column3).toBe('value3_2')
      expect(parsed[model1.getIdentifier()].version).toBe(0)
    })
  })

  describe('parse() should', () => {
    test('return empty map given no values', () => {
      // prepare
      const formatter = getFormatter()
      const json = '{}'

      // act
      const map = formatter.parse(new FakeTable('table', ['col1']), json)
      expect(map.size).toBe(0)
    })

    test('return model mapped by identifier given values', () => {
      // prepare
      const formatter = getFormatter()

      const json = '{"123456789":{'
        + '"db_column1":"value1",'
        + '"db_column2":"value2",'
        + '"db_column3":"value3",'
        + '"id":"123456789"'
      + '}}'

      // act
      const map = formatter.parse(
        new FakeTable('table', [ 'db_column1', 'db_column2', 'db_column3' ]), 
        json,
      )
      expect(map.size).toBe(1)
      expect(map.has('123456789')).toBe(true)
      expect(map.get('123456789')).toBeInstanceOf(FakeModel)
    })

    test('return multiple models mapped by identifier given multiple rows', () => {
      // prepare
      const formatter = getFormatter()

      const json = '{"1234":{'
        + '"db_column1":"value1",'
        + '"db_column2":"value2",'
        + '"db_column3":"value3",'
        + '"id":"1234"'
        + '},"5678":{'
        + '"db_column1":"value1_2",'
        + '"db_column2":"value2_2",'
        + '"db_column3":"value3_2",'
        + '"id":"5678"'
      + '}}'

      // act
      const map = formatter.parse(
        new FakeTable('table', [ 'db_column1', 'db_column2', 'db_column3' ]), 
        json,
      )
      expect(map.size).toBe(2)
      expect(map.has('1234')).toBe(true)
      expect(map.get('1234')).toBeInstanceOf(FakeModel)
      expect(map.has('5678')).toBe(true)
      expect(map.get('5678')).toBeInstanceOf(FakeModel)
    })

    test('return parsed models with values given multiple rows', () => {
      // prepare
      const formatter = getFormatter()

      const json = '{"1234":{'
        + '"db_column1":"value1",'
        + '"db_column2":"value2",'
        + '"db_column3":"value3",'
        + '"id":"1234"'
        + '},"5678":{'
        + '"db_column1":"value1_2",'
        + '"db_column2":"value2_2",'
        + '"db_column3":"value3_2",'
        + '"id":"5678"'
      + '}}'

      // act
      const map = formatter.parse(
        new FakeTable('table', [ 'db_column1', 'db_column2', 'db_column3' ]), 
        json,
      )
      const model1 = map.get('1234')
      const model2 = map.get('5678')

      // assert
      expect(model1).toBeDefined()
      expect(model2).toBeDefined()
      expect(model1.getIdentifier()).toBe('1234')
      expect(model1.values.get('id')).toBe('1234')
      expect(model1.values.get('db_column1')).toBe('value1')
      expect(model1.values.get('db_column2')).toBe('value2')
      expect(model1.values.get('db_column3')).toBe('value3')
      expect(model2.getIdentifier()).toBe('5678')
      expect(model2.values.get('id')).toBe('5678')
      expect(model2.values.get('db_column1')).toBe('value1_2')
      expect(model2.values.get('db_column2')).toBe('value2_2')
      expect(model2.values.get('db_column3')).toBe('value3_2')
    })
  })
})
