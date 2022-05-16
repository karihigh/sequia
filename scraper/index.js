const puppeteer = require('puppeteer');
const csv = require('csv-parser')
const fs = require('fs')

let input = { data: []}

fs.createReadStream('PobladosChile.csv')
    .pipe(csv())
    .on('data', (row) => {
        input.data.push(row)
    })
    .on('end', () => {
        // console.log(input.data[0].NOMBRE)
        (async () => {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
        })
        // TODO: avoid captcha (it banned me after 64 tries)
        // for(let i = 765; i < input.data.length; i++){
        for(let i = 765; i < 1094; i++){
            if(input.data[i].COD_REG == '01'){
                let lat = input.data[i].point_latitude
                let lon = input.data[i].point_longitude
                let id = input.data[i].ID
                let name = input.data[i].NOMBRE
                // await page.goto('https://www.google.com/maps/@-17.8553097,-69.6423837,1300m/data=!3m1!1e3')
                await page.goto('https://www.google.com/maps/@' + lat + ',' + lon + ',1300m/data=!3m1!1e3')
                let wait = 10000 + Math.trunc(Math.random() * 20000)
                await page.waitFor(1500)
                let path = id + '_' + name + '.png'
                await page.screenshot({path: path})
            }
        }
        
        await browser.close()
        })()
    })