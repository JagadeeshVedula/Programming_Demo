import { test } from '../src/fixtures/base-fixture'


test('get all products from API @API',async({API})=>{
    await API.getDataUsingAPI('https://automationexercise.com/','api/productsList')
})
test('search product using API @API',async({API})=>{
    await API.postDataUsingAPI('https://automationexercise.com/','api/searchProduct',{search_product:"top"})
})