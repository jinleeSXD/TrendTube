/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { RowDataPacket, OkPacket } from 'mysql2'
import { Request } from 'express'

export interface UserPassword extends RowDataPacket {
  username: string
  email: string
  passwordHash: string
}

export interface UserRequest extends Request {
  username: string
  email: string
}

export type DeleteQuery = {
  success: boolean
  message?: string
  result?: OkPacket
}

export type CreateQuery = {
  success: boolean
  message?: string
  result?: OkPacket
}

export type UpdateQuery = {
  success: boolean
  message?: string
  result?: OkPacket
}
