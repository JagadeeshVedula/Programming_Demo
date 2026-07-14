import fs from 'fs'
import path from 'path'
import { test } from '../src/fixtures/base-fixture'

const credentials = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'Data', 'credentials.json'), 'utf-8'))

test('valid and invalid login flow @regression', async ({ Base, Login, page }) => {
    await Base.navigate('/')

    await Login.clickOnLoginButton()
    await Login.loginWithInvalidCredentials({
        username: 'invalid@example.com',
        password: 'wrongpassword'
    })

    await Login.clickOnLoginButton()
    await Login.loginWithValidCredentials(credentials)

    await Base.isElementFound(page.locator('//a[@href="/logout"]'))
})
