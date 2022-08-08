import { urlShortenSchema } from "../schemas/urlSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function urlShortenValidator(req, res, next) {
  const urlBody = req.body;
  const validation = urlShortenSchema.validate(urlBody);
  if (validation.error) {
    console.log(validation.error);
    return res.sendStatus(422); // bad request
  }
  const urlId = await connection.query(
    `SELECT id FROM urls WHERE url='${urlBody.url}'`
  );
  res.locals.urlId = urlId;

  next();
}

export async function urlOneValidator(req, res, next) {
  const { id } = req.params;
  const result = await connection.query(
    `SELECT "userUrl".id AS id ,"shortUrl",url FROM "userUrl" JOIN urls ON "userUrl"."urlId"=urls.id WHERE "userUrl".id = $1`,
    [id]
  );
  if (!result.rows[0]) {
    return res.sendStatus(404);
  }
  res.locals.result = result;

  next();
}
export async function shortUrlValidator(req, res, next) {
  const { shortUrl } = req.params;
  const resultUserUrl = await connection.query(
    `SELECT "userUrl".id AS id, "userUrl"."visitCount" AS "visitCount" , url FROM "userUrl"  JOIN urls ON "userUrl"."urlId"=urls.id WHERE "shortUrl"= $1`,
    [shortUrl]
  );
  if (!resultUserUrl.rows[0]) {
    return res.sendStatus(404);
  }
  res.locals.resultUserUrl = resultUserUrl;
  next();
}

export async function dellUrlValidator(req, res, next) {
  const { session } = res.locals;
  const userId = session;
  const { id } = req.params;
  const existId = await connection.query(
    `SELECT * FROM "userUrl" WHERE id = $1`,
    [id]
  );
  const existUser = await connection.query(
    `SELECT * FROM "userUrl" WHERE "userId"=${userId.rows[0].id} AND id = $1`,
    [id]
  );

  if (!existId.rows[0]) {
    return res.sendStatus(404);
  }
  if (!existUser.rows[0]) {
    return res.sendStatus(401);
  }

  next();
}
