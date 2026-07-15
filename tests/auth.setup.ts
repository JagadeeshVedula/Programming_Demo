import {test} from '@playwright/test'
import { LoginPage } from '../src/pages/login-page'
import { BasePage } from '../src/pages/base-page'
import { createCustomLogger } from '../src/utils/custom-logger'
import fs from 'fs'
import path from 'path'
const credentials = JSON.parse(fs.readFileSync(path.join(process.cwd(),"Data","credentials.json"),'utf-8'))


test('Test Setup with Admin Login', async({page})=>{
  const log = createCustomLogger(test.info().title)
  const base = new BasePage(page,log)
  const login = new LoginPage(page,log)
  await base.navigate('/')
  await login.clickOnLoginButton()
  await login.loginWithValidCredentials(credentials)
  await page.context().storageState({path:'storage/user_auth.json'})
})