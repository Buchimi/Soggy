import { parse, HtmlGenerator } from 'latex.js'
import { createHTMLWindow } from 'svgdom'
import {createWriteStream, readFileSync} from "fs"
import PDFDocument from 'pdfkit'
import puppeteer from 'puppeteer'

global.window = createHTMLWindow()
global.document = window.document


// let latex = "Hi, this is a line of text."
// const latex =
let latex = readFileSync("la.tex").toString()
// console.log(latex);
let generator = new HtmlGenerator({ hyphenate: false })

let latexDoc = parse(latex, { generator: generator }).htmlDocument()

const outputpath = "output.pdf"
const pdfdoc = new PDFDocument()
const writeStream = createWriteStream(outputpath)
const html = latexDoc.documentElement.outerHTML
pdfdoc.pipe(writeStream)

pdfdoc.text(html)

pdfdoc.end()

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setContent(html)

await page.pdf({
    path : "output1.pdf",
    format: 'A4',
    printBackground: true
})
await browser.close()
