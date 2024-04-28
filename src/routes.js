import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { decoderQueryParam } from './utils/decoder-query-params.js'
import { validateRequiredField } from './utils/validate-required-field.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const decodedSearch = decoderQueryParam(search)

      const tasks = database.select('tasks', search ? {
        title: decodedSearch,
        description: decodedSearch
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = JSON.parse(req.body)

      if (validateRequiredField(title)) {
        return res.writeHead(400).end(JSON.stringify({ message: 'title is required' }))
      }

      if (validateRequiredField(description)) {
        return res.writeHead(400).end(JSON.stringify({ message: 'description is required' }))
      }

      const newTask = {
        id: randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
        title,
        description,
        completed_at: null
      }
      
      database.insert('tasks', newTask)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = JSON.parse(req.body)

      try {
        database.update('tasks', id, { title, description});
        
        return res.end()
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify({ message: error.message }))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.update('tasks', id);
        
        return res.end()
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify({ message: error.message }))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id);
        
        return res.end()
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify({ message: error.message }))
      }
    }
  }
]