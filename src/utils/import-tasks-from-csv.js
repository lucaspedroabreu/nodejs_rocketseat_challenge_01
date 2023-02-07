import fs from 'node:fs'
import { parse } from 'csv-parse'
import { randomUUID } from 'node:crypto'

const filePath = new URL('../../sample-tasks-data.csv', import.meta.url)

export async function importTasksFromCSV(req, res) {
  console.log('Importing csv data...')
  fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', (row) => {
      console.log(row)
      req.database.insert('tasks', {
        id: randomUUID(),
        title: row[0],
        description: row[1],
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      })
    })
    .on('end', () => {
      console.log('Finished importing csv data!')

      return
    })
    .on('error', (error) => {
      console.log(error.message)
    })
}
