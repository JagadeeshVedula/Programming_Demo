import { APIRequestContext,expect } from "@playwright/test";
import winston from 'winston'
export class APIContext {
    private readonly request:APIRequestContext
    private readonly log: winston.Logger
    constructor(request:APIRequestContext,log:winston.Logger){
        this.request = request
        this.log=log
    }

    async getHeaders(){
        return { 'Authorization':`Bearer token`,
                 'Accept': 'application/json'}
    }
    
    async postHeaders(){
        return {'content-type': 'application/x-www-form-urlencoded'}
    }
    async getDataUsingAPI<T>(baseUrl:string,endPoint:string):Promise<T>{
        try{
            const url = baseUrl+endPoint
            this.log.debug(`trying to get data from API - ${url}`)
            const response = await this.request.get(url,{headers:await this.getHeaders()})
            expect(response.ok).toBeTruthy()
            if (response.status()==200){
                this.log.info(`retrieved data successfully with status - ${response.status()} from API - ${url}`)
                this.log.debug(`Retrieved data - ${JSON.stringify(await response.json(),null,2)}`)
                const rawText = await response.text();
                // 2. Parse the string into a JavaScript Object
                const responseBody = JSON.parse(rawText);
                expect(responseBody).toMatchObject({
                        responseCode: expect.any(Number),
                        products: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            price: expect.stringMatching(/^Rs\.\s\d+$/), // Regex: Ensures format is exactly "Rs. <numbers>"
                            brand: expect.any(String),
                            category: expect.objectContaining({
                            usertype: expect.objectContaining({
                                usertype: expect.any(String)
                            }),
                            category: expect.any(String)
                            })
                        })
                        ])
                    });
                this.log.info(`schema matched perfectly`)
                return response as T
            }
            else{
                this.log.error(`API call failed to url - ${url} with status - ${response.status()}`)
                return response as T
            }
            
        }
        catch (error){
            this.log.error(`failed to retrieve data from API - ${baseUrl+endPoint} due to exception - ${error}`)
            throw new Error(`failed to retrieve data from API - ${baseUrl+endPoint} due to exception - ${error}`)
        }
    }

    async postDataUsingAPI(baseUrl:string,endPoint:string,payload:Record<string,string>){
        const url = baseUrl+endPoint
        this.log.debug(`trying to post data through API - ${url}`)
        const response = await this.request.post(url,{headers:await this.getHeaders(),form:payload})
        expect(response.ok).toBeTruthy()
        this.log.debug(`posted data - ${JSON.stringify(await response.json(),null,2)}`)
    }

}