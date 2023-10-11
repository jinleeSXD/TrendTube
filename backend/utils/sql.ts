import mysql from 'mysql2'
import { CreateQuery, DeleteQuery, UpdateQuery } from './types'

/* Helper methods for making a CRUD MySQL Queries */

export const runGetQuery = async <T extends mysql.RowDataPacket>(
  pool: mysql.Pool,
  queryToRun: string
): Promise<{
  success: boolean
  message?: string
  result?: T[]
}> => {
  return new Promise(resolve => {
    pool.getConnection(function (err, con) {
      if (err) {
        console.error(err)
        return resolve({
          success: false,
          message: err.message,
        })
      }
      con.query<T[]>(queryToRun, (error, result) => {
        con.release();
        if (error) {
          resolve({
            success: false,
            message: error.message,
          })
        }
        resolve({
          success: true,
          result,
        })
      })
    })
  })
}

export const runDeleteQuery = async (
  pool: mysql.Pool,
  queryToRun: string
): Promise<DeleteQuery> => {
  return new Promise(resolve => {
    pool.getConnection(function (err, con) {
      if (err) {
        console.error(err)
        return resolve({
          success: false,
          message: err.message,
        })
      }
      con.query<mysql.OkPacket>(queryToRun, (error, result) => {
        con.release();
        if (error) {
          resolve({
            success: false,
            message: error.message,
          })
        }
        resolve({
          success: true,
          result,
        })
      })
    })
  })
}

export const runCreateQuery = async (
  pool: mysql.Pool,
  queryToRun: string
): Promise<CreateQuery> => {
  return new Promise(resolve => {
    pool.getConnection(function (err, con) {
      if (err) {
        console.error(err)
        return resolve({
          success: false,
          message: err.message,
        })
      }
      con.query<mysql.OkPacket>(queryToRun, (error, result) => {
        con.release();
        if (error) {
          resolve({
            success: false,
            message: error.message,
          })
        }
        resolve({
          success: true,
          result,
        })
      })
    })
  })
}

export const runUpdateQuery = async (
  pool: mysql.Pool,
  queryToRun: string
): Promise<UpdateQuery> => {
  return new Promise(resolve => {
    pool.getConnection(function (err, con) {
      if (err) {
        console.error(err)
        return resolve({
          success: false,
          message: err.message,
        })
      }
      con.query<mysql.OkPacket>(queryToRun, (error, result) => {
        con.release();
        if (error) {
          resolve({
            success: false,
            message: error.message,
          })
        }
        resolve({
          success: true,
          result,
        })
      })
    })
  })
}
