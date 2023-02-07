import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return (
          row.title.toLowerCase().includes(search.toLowerCase()) ||
          row.description.toLowerCase().includes(search.toLowerCase())
        )
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    console.log('Inserting data into database...')

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else {
      return new Error('Id not found')
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      if (row.completed_at !== null) {
        this.#database[table][rowIndex] = {
          ...row,
          updated_at: new Date().toISOString(),
          completed_at: null,
          ...data,
        }
      } else {
        this.#database[table][rowIndex] = {
          ...row,
          updated_at: new Date().toISOString(),
          ...data,
        }
      }
      this.#persist()
    }
  }
}
