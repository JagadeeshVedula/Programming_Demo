import { test } from '@playwright/test'
import path from 'path'
import dotenv from 'dotenv'
import { LoginPage } from '../src/pages/login-page'
import { BasePage } from '../src/pages/base-page'
import { createCustomLogger } from '../src/utils/custom-logger'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const credentials = {
  username: process.env.AUTOMATION_USERNAME?.trim() || '',
  password: process.env.AUTOMATION_PASSWORD?.trim() || '',
}

test('Test Setup with Admin Login', async ({ page }) => {
  const log = createCustomLogger(test.info().title)
  const base = new BasePage(page, log)
  const login = new LoginPage(page, log)

  if (!credentials.username || !credentials.password) {
    throw new Error('AUTOMATION_USERNAME and AUTOMATION_PASSWORD must be set in the environment')
  }

  try {
    await base.navigate('/')
    await login.clickOnLoginButton()
    await login.loginWithValidCredentials(credentials)
    await page.context().storageState({ path: 'storage/user_auth.json' })
  } catch (error) {
    await page.screenshot({ path: `test-results/auth-setup-failure.png`, fullPage: true })
    throw error
  }
})