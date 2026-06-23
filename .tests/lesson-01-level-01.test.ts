import { describe, test, expect } from 'vitest'
import { lessonDir, importDefault, runNode, exists } from './utils/test-helpers'

describe('lesson-01-level-01-node-command', () => {
  test('NodeJS is installed.', async () => {
    const { stdout } = await runNode(['--version'])
    expect(stdout).toMatch(/^v?\d+\.\d+\.\d+/)
  })

  test('The lesson folder contains secret.js', async () => {
    const dir = lessonDir('lesson-01-nodejs/level-01-node-command')
    const secretPath = `${dir}/secret.js`
    expect(exists(secretPath)).toBe(true)
  })

  // secret.js default-exports a value using export default
  test('secret.js default-exports a value using export default', async () => {
    const dir = lessonDir('lesson-01-nodejs/level-01-node-command')
    const secretPath = `${dir}/secret.js`
    const def = await importDefault(secretPath)
    expect(def).toBeDefined()
  })

  test('The default export from secret.js is a string.', async () => {
    const dir = lessonDir('lesson-01-nodejs/level-01-node-command')
    const secretPath = `${dir}/secret.js`
    const def = await importDefault(secretPath)
    expect(typeof def).toBe('string')
  })

  test('The exported string from secret.js is the secret message.', async () => {
    const dir = lessonDir('lesson-01-nodejs/level-01-node-command')
    const secretPath = `${dir}/secret.js`
    const def = await importDefault(secretPath)
    expect(def).toBe('You ran JavaScript without a browser!')
  })
})
