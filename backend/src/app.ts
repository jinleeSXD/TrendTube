import * as dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response } from 'express'
import mysql from 'mysql2'
import bodyParser from 'body-parser'
import cors from 'cors'

import cookie_parser from 'cookie-parser'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'

import {
  runGetQuery,
  runCreateQuery,
  runDeleteQuery,
  runUpdateQuery,
} from '../utils/sql'
import { sendResponse } from '../utils/res'

import { UserPassword } from '../utils/types'

import { authMiddleware, errorWrap } from '../utils/res'
console.log(process.env.HOST);
const pool = mysql.createPool({
  host: process.env.HOST,
  user: 'root',
  password: process.env.PASSWORD,
  database: 'Trentube_DB',
})

/*

Stored Procedure

Get top videos and top channels based on keyword


Histogram for common words in the title and tags of trending videos


Input: keyword1, keyword2, limit

for channels that are favorited by the current user or 

We could write a trigger that will create a new channel 
if we insert a video that doesn't have a corresponding channel in the database. 

*/

pool.getConnection(function(err, connection) {
  if(err) { 
    connection.connect(function (err) {
      if (err) throw err
      console.log('Connected!')
    })
  }
});


const app: Application = express()
const router = express.Router()
router.use(cookie_parser(process.env.COOKIE_HASH))

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// const whitelist = ['http://localhost:3000', 'http://localhost:3001']
// const corsOptions: CorsOptions = {
//   origin: function (origin, callback) {
//     if (origin !== undefined) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//   },
//   credentials: true,
// }
router.use(
  cors({
    origin: true,
    credentials: true,
  })
)

const port = 3000

router.get('/', (req: Request, res: Response) => {
  res.status(200).send('up and running')
})

// create a new user
router.post(
  '/user',
  errorWrap(async (req: Request, res: Response) => {
    const { username, firstName, lastName, password, email } = req.body
    console.log(req.body)
    const passwordSalt = bcrypt.genSaltSync(10)

    const passwordHash = bcrypt.hashSync(password, passwordSalt)

    const sql = `INSERT INTO User VALUES ('${username}', '${firstName}', '${lastName}', '${passwordHash}', '${passwordSalt}', '${email}')`
    const { success, result, message } = await runCreateQuery(pool, sql)

    if (success) {
      const token = jwt.sign(
        {
          username,
          email,
        },
        String(process.env.JWT_HASH),
        { expiresIn: '24h' }
      )
      return res
        .status(200)
        .cookie('token', token, { httpOnly: true })
        .json({ success: true, message: 'user created' })
    }
    console.log(message);
    return sendResponse(res, success, message, result)
  })
)

router.get(
  '/allUsers',
  errorWrap(async (req: Request, res: Response) => {
    const sql = `SELECT username, firstName, lastName, email FROM User`
    const { success, result } = await runGetQuery(pool, sql)
    console.log(result)
    return sendResponse(res, success, 'Got all users', result)
  })
)

// login a user
router.get(
  '/user',
  errorWrap(async (req: Request, res: Response) => {
    const { username, password } = req.query

    const sql = `SELECT username, email, passwordHash FROM User WHERE username='${username}'`
    const { success, result } = await runGetQuery<UserPassword>(pool, sql)

    if (success && result && result.length > 0) {
      const { username, email, passwordHash } = result[0]
      const isValidPassword = await bcrypt.compare(
        String(password),
        passwordHash
      )

      if (!isValidPassword) {
        return sendResponse(res, false, 'Invalid Password', {})
      }
      const token = jwt.sign(
        {
          username,
          email,
        },
        String(process.env.JWT_HASH),
        { expiresIn: '24h' }
      )

      return res
        .header('Access-Control-Allow-Credentials', 'true')
        .status(200)
        .cookie('token', token, { httpOnly: true })
        .json({ success: true, message: 'user logged in' })
    } else {
      return sendResponse(res, false, "User doesn't exist", {})
    }
  })
)

// favorite a channel
router.post(
  '/user/channel/favorite',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { id } = req.body
    const { username } = req.headers
    const sql = `INSERT INTO Favorites VALUES ('${username}', '${id}')`
    const { success, result, message } = await runCreateQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Get user favorited channels
router.get(
  '/user/channel/favorite',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { username } = req.headers
    const sql = `SELECT * FROM Channel c NATURAL JOIN Favorites f WHERE f.username = '${username}' and f.channelId = c.id`
    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Keyword search through all channels
router.get(
  '/channel/search',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { keyword, limit } = req.query
    let sql = `SELECT * FROM Channel c WHERE c.channelTitle LIKE '%${keyword}%'`

    if (!keyword || keyword === '') {
      sql = `SELECT * FROM Channel c`
    }

    if (limit) {
      sql += ` LIMIT ${limit}`
    }

    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Get user info
router.get(
  '/user/info',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { username } = req.headers
    console.log(username)
    const sql = `SELECT username, firstName, lastName, email FROM User u WHERE username='${username}'`
    const { success, result, message } = await runGetQuery(pool, sql)
    console.log(result)
    return sendResponse(res, success, message, result)
  })
)

// Update a user's firstName, lastName, and email
router.put(
  '/user/info',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body
    const { username } = req.headers
    const sql = `UPDATE User u SET firstName = '${firstName}', lastName = '${lastName}', email = '${email}' WHERE username = '${username}'`
    const { success, result, message } = await runUpdateQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Delete a user
router.delete(
  '/user',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { username } = req.headers
    const sql = `DELETE FROM User WHERE username = '${username}'`
    const { success, result, message } = await runDeleteQuery(pool, sql)

    res.clearCookie('token')

    return sendResponse(res, success, message, result)
  })
)

// Unfavorite a channel
router.delete(
  '/user/channel/unfavorite',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { channelId } = req.query
    const { username } = req.headers
    const sql = `DELETE FROM Favorites f WHERE f.channelId = '${channelId}' and f.username = '${username}'`

    const { success, result, message } = await runDeleteQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Complex aggregation 1
router.get(
  '/aggregate1',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const sql = `SELECT c.channelTitle, AVG(v.likes) as avgLikes, AVG(v.commentCount) avgComments
              FROM Trentube_DB.Video v JOIN Trentube_DB.Channel c ON (v.channelId=c.id)
              WHERE v.title LIKE '%music%' and v.id IN (SELECT id
                                                        FROM Trentube_DB.Video
                                                        WHERE views > 100000 and likes > 100000)
              GROUP BY c.channelTitle
              ORDER BY avgLikes, avgComments DESC
              LIMIT 15`

    const { success, result, message } = await runCreateQuery(pool, sql)
    console.log(result)

    return sendResponse(res, success, message, result)
  })
)

// Complex aggregation 2
router.get(
  '/aggregate2',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const sql = `(SELECT v.id, v.title
                FROM Trentube_DB.Video v JOIN Trentube_DB.Tagged td ON (td.videoId = v.id) JOIN Trentube_DB.Tag tg ON (td.tagId=tg.id)
                WHERE tg.title LIKE '%music%' AND (v.description LIKE  '%music%'  AND v.title LIKE '%music%' ))
                UNION
                (SELECT v.id, v.title
                FROM Trentube_DB.Video v JOIN Trentube_DB.Tagged td ON (td.videoId = v.id) JOIN Trentube_DB.Tag tg ON (td.tagId=tg.id)
                WHERE tg.title LIKE '%sport%' AND (v.description LIKE  '%sport%'  AND v.title LIKE '%sport%' ))
                LIMIT 15`

    const { success, result, message } = await runCreateQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Complex aggregation 1 with user input
router.get(
  '/aggregateWithInput1',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { keyword1, limit } = req.query
    console.log(keyword1)
    const sql = `SELECT c.channelTitle, AVG(v.likes) as avgLikes, AVG(v.commentCount) avgComments
              FROM Trentube_DB.Video v JOIN Trentube_DB.Channel c ON (v.channelId=c.id)
              WHERE v.title LIKE '%${keyword1}%' and v.id IN (SELECT id
                                                        FROM Trentube_DB.Video
                                                        WHERE views > 100000 and likes > 100000)
              GROUP BY c.channelTitle
              ORDER BY avgLikes DESC, avgComments DESC
              LIMIT ${limit}`

    const { success, result, message } = await runCreateQuery(pool, sql)
    console.log(result)

    return sendResponse(res, success, message, result)
  })
)

// Complex aggregation 2 with user input
router.get(
  '/aggregateWithInput2',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { keyword1, keyword2, limit } = req.query
    const sql = `(SELECT v.id, v.title, v.likes as likes
                FROM Trentube_DB.Video v JOIN Trentube_DB.Tagged td ON (td.videoId = v.id) JOIN Trentube_DB.Tag tg ON (td.tagId=tg.id)
                WHERE tg.title LIKE '%${keyword1}%' AND (v.description LIKE  '%${keyword1}%'  AND v.title LIKE '%${keyword1}%' ))
                UNION
                (SELECT v.id, v.title, v.likes as likes
                FROM Trentube_DB.Video v JOIN Trentube_DB.Tagged td ON (td.videoId = v.id) JOIN Trentube_DB.Tag tg ON (td.tagId=tg.id)
                WHERE tg.title LIKE '%${keyword2}%' AND (v.description LIKE  '%${keyword2}%'  AND v.title LIKE '%${keyword2}%' ))
                ORDER BY likes DESC
                LIMIT ${limit}`

    const { success, result, message } = await runCreateQuery(pool, sql)

    console.log(result)

    return sendResponse(res, success, message, result)
  })
)

// Keyword search through video by title
router.get(
  '/video/search',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { keyword, limit } = req.query
    let sql = `SELECT * FROM Video v WHERE v.title LIKE '%${keyword}%'`

    if (!keyword || keyword === '') {
      sql = `SELECT * FROM Video v`
    }

    if (limit) {
      sql += ` LIMIT ${limit}`
    }

    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Get all Videos where id is in TrendHistory ordered by publish date descending
router.get(
  '/trendhistory/video',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const sql = `SELECT * FROM Video c NATURAL JOIN TrendHistory t WHERE t.id = c.id ORDER BY c.publishedAt DESC`
    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Get video data for all channels in trending
router.get(
  '/trending/video',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { limit } = req.query
    let sql = `SELECT * FROM Channel c JOIN Video v on c.id = v.channelId JOIN Trending t on t.trendId = v.id`
    if (limit) {
      sql += ` LIMIT ${limit}`
    }
    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Get video data for all channels in trending by inputs
router.get(
  '/trending/video/inputs',
  // authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const {
      channel_id,
      // start_date,
      // end_date,
      // text_title_desc,
      // category,
      // tag,
      limit,
    } = req.query
    let sql = `SELECT * 
               FROM Channel c 
               JOIN Video v on c.id = v.channelId 
               JOIN Trending t on t.trendId = v.id 
               WHERE c.id = "${channel_id}"
               `
    // let sql = `SELECT *
    //            FROM Channel c
    //            JOIN Video v on c.id = v.channelId
    //            JOIN Trending t on t.trendId = v.id
    //            JOIN Category cg ON cg.id = v.categoryId
    //            JOIN Tagged tgd ON tgd.videoId = v.id
    //            JOIN Tag tg ON tg.id = tgd.tagId
    //            WHERE c.id = ${channel_id}
    //            AND (v.description LIKE %${text_title_desc}% OR v.title LIKE %${text_title_desc}%)
    //            AND (v.publishedAt >= ${start_date} AND v.publishedAt <= ${end_date})
    //            AND (cg.categoryTitle = ${category})
    //            AND (tg.title LIKE %${tag}%)`
    if (limit) {
      sql += ` LIMIT ${limit}`
    }
    const { success, result, message } = await runGetQuery(pool, sql)
    return sendResponse(res, success, message, result)
  })
)

// Creates a new video
router.post(
  '/video',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const {
      id,
      title,
      publishedAt,
      views,
      likes,
      dislikes,
      description,
      commentCount,
      thumbnailLink,
      channelId,
      categoryName,
    } = req.body

    const categoryIdSql = `SELECT c.id FROM Category c WHERE c.categoryTitle='${categoryName}'`
    const {
      success: categorySuccess,
      result: categoryResult,
      message: categoryMessage,
    } = await runGetQuery(pool, categoryIdSql)

    if (categorySuccess && categoryResult && categoryResult.length > 0) {
      const { id: categoryId } = categoryResult[0]
      console.log(categoryId)

      const sql = `INSERT INTO Video VALUES ('${id}', '${title}', '${publishedAt}', ${views}, ${likes}, ${dislikes}, 0, 0, '${description}', ${commentCount}, '${thumbnailLink}', '${channelId}', ${categoryId})`
      const { success, result, message } = await runCreateQuery(pool, sql)

      return sendResponse(res, success, message, result)
    }

    return sendResponse(res, categorySuccess, categoryMessage, categoryResult)
  })
)

// Creates a new video
router.post(
  '/trending/video',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { videoId, trendId, country, trendDate } = req.body

    const trendSql = `INSERT INTO TrendHistory VALUES (${trendId}, '${country}', '${trendDate}')`
    const {
      success: trendSuccess,
      message: trendMessage,
      result: trendResult,
    } = await runGetQuery(pool, trendSql)

    if (trendSuccess) {
      const trendSql = `INSERT INTO Trending VALUES (${trendId}, '${videoId}')`
      const { success, result, message } = await runGetQuery(pool, trendSql)

      return sendResponse(res, success, message, result)
    }

    return sendResponse(res, trendSuccess, trendMessage, trendResult)
  })
)

// Creative component
router.get(
  '/creative',
  authMiddleware,
  errorWrap(async (req: Request, res: Response) => {
    const { title, viewCount, likeCount, dislikeCount, comments, limit } =
      req.query

    const sql = `CALL CreativeComp('%${title}%', ${viewCount}, ${likeCount}, ${dislikeCount}, ${comments}, ${limit})`
    const { success, result, message } = await runGetQuery(pool, sql)
    console.log(message);
    return sendResponse(res, success, message, result)
  })
)

app.use('/api', router)

app.listen(port, function () {
  console.log(`App is listening on port ${port}!`)
  console.log(`Connecting to host: ${process.env.HOST}`)
})
