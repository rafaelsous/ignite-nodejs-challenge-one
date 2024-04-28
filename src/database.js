import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      }).catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value)
        })
      })
    }

    const transformedData = data.map(item => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        completedAt: item.completed_at
      }
    })

    return transformedData
  }

  insert(table, data) {
    const hasData = Array.isArray(this.#database[table])

    if (hasData) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  delete(table, id) {
    const hasData = Array.isArray(this.#database[table])
    const rowIndex = hasData 
      ? this.#database[table].findIndex(row => row.id === id)
      : -1

    if (!hasData || rowIndex === -1) {
      throw new Error('Resource not exists')
    }

    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }

  update(table, id, data) {
    const hasData = Array.isArray(this.#database[table])
    const rowIndex = hasData 
      ? this.#database[table].findIndex(row => row.id === id)
      : -1

    if (!hasData || rowIndex === -1) {
      throw new Error('Resource not exists')
    }

    const task = this.#database[table][rowIndex]
    const updatedTask = data 
    ? {
      ...task,
      title: data.title ? data.title : task.title,
      description: data.description ? data.description : task.description,
      updated_at: new Date(),
    } : {
      ...task,
      updated_at: new Date(),
      completed_at: task.completed_at ? null : new Date()
    }

    this.#database[table][rowIndex] = updatedTask

    this.#persist()
  }
}