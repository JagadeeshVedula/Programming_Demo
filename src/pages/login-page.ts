import {Page,Locator} from '@playwright/test'
import { BasePage } from './base-page'
import winston from 'winston'
type credentials={
    username:string;
    password:string;
    role?:string
}
export class LoginPage extends BasePage{
    private readonly loginHomepageButton:Locator;
    private readonly usernamefield:Locator;
    private readonly passwordfield:Locator;
    private readonly submitbutton:Locator;
    private readonly logoutbutton:Locator;
    private readonly invalidLoginMessage:Locator;

    constructor(page:Page,log:winston.Logger){
        super(page,log)
        this.usernamefield = page.locator('xpath=//input[@data-qa="login-email"]');
        this.passwordfield = page.locator('//input[@type="password"]');
        this.submitbutton = page.locator('//button[@data-qa="login-button"]');
        this.loginHomepageButton=page.locator('//*[text()=" Signup / Login"]');
        this.logoutbutton = page.locator('//a[@href="/logout"]')
        this.invalidLoginMessage = page.locator("text=Your email or password is incorrect!")
    }

    async clickOnLoginButton(){
        await this.clickElement(this.loginHomepageButton)
    }

    async loginWithValidCredentials(cred:credentials){
        await this.inputText(this.usernamefield,cred.username)
        await this.inputText(this.passwordfield,cred.password)
        await this.clickElement(this.submitbutton)
        await this.pauseExecution()
        await this.isElementFound(this.logoutbutton)
    }

    async loginWithInvalidCredentials(cred:credentials){
        await this.inputText(this.usernamefield,cred.username)
        await this.inputText(this.passwordfield,cred.password)
        await this.clickElement(this.submitbutton)
        await this.pauseExecution()
        await this.isElementFound(this.invalidLoginMessage)
    }


}