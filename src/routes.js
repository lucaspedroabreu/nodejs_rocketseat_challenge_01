import { buildRoutePath } from './utils/build-route-path.js'
import { importTasksFromCSV } from './utils/import-tasks-from-csv.js'
import { randomUUID } from 'node:crypto'

import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/'),
    handler: (req, res) => {
      return res.writeHead(200).end("You've successfully reached the index route on our back-end.")
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        res.writeHead('400').end('Creating a task requires both title and description')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      }

      database.insert('tasks', task)

      res.writeHead('201').end('Task created')
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end('Updating a task requires title or description data')
      }

      const updatedTask = {
        title,
        description,
      }

      database.update('tasks', id, updatedTask)
      res.writeHead('204').end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const completedTask = {
        completed_at: new Date().toISOString(),
      }

      try {
        database.update('tasks', id, completedTask)
      } catch (error) {
        return res.writeHead('400').end(error.message)
      }

      res.writeHead('204').end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.database.delete('tasks', id)
      } catch (error) {
        return res.writeHead('400').end(error.message)
      }

      res.writeHead('204').end('Task deletion successful')
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/upload'),
    handler: async (req, res) => {
      req.database = database

      await importTasksFromCSV(req, res)

      return res.writeHead(200).end("You've successfully uploaded a CSV file to our backend!.")
    },
  },
]
