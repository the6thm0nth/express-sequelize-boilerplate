import models from '../../../models'
import { asyncMiddleware } from '../../../lib/middlewares'

import config from '../../../../config'

export const get = asyncMiddleware(async (req, res, next) => {
  const query = req.query

  const page = Number(query.page || config.pagination.defaultPage)
  const pageSize = Number(query.pageSize || config.pagination.defaultPageSize)

  try {
    const posts = await models.Post.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize
    })

    res.set('x-page', page)
    res.set('x-page-size', pageSize)
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

export const remove = asyncMiddleware(async (req, res, next) => {
  const id = req.params.id

  try {
    await models.Post.update(
      {
        deleted: true
      },
      {
        where: { id }
      }
    )

    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})