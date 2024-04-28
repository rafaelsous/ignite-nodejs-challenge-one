import fs from 'node:fs'
import { parse } from 'csv-parse'

const filePath = new URL('../../csv/data.csv', import.meta.url)

async function processCsvFile() {
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
      columns: true,
      from: 1
    }))

  for await (const record of parser) {
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(record)
    })
    
    // await wait(5000)
  }
}

processCsvFile()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
