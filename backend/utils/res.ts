import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 * Convienience function for sending responses.
 * @param {Object} res The response object
 * @param {Number} code The HTTP response code to send
 * @param {String} message The message to send.
 * @param {Object} data The optional data to send back.
 */
export const sendResponse = async (
  res: Response,
  success: boolean,
  message: string | undefined,
  result = {}
) => {
  await res.status(getCode(success)).json({
    success,
    message,
    result,
  })
}

/**
 * Authenticates user with JWT token set in cookies
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies

  console.log(req.cookies);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'No user is logged in',
    })
  } else {
    let decodedToken = null

    try {
      decodedToken = jwt.verify(
        token,
        String(process.env.JWT_HASH)
      ) as JwtPayload
    } catch {
      res.status(401).json({
        success: false,
        message: 'Error validating token',
      })
    }

    if (!decodedToken) {
      res.status(401).json({
        success: false,
        message: 'Invalid login',
      })
    } else {
      req.headers.username = decodedToken.username
      req.headers.email = decodedToken.email

      next()
    }
  }
}

/*
 * Middleware to allow us to safely handle errors in async/await code
 * without wrapping each route in try...catch blocks
 */
export const errorWrap =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

const getCode = (success: boolean) => (success ? 200 : 400)
