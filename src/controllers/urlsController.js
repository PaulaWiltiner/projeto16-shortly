import connection from "../dbStrategy/postgres.js";
import { nanoid } from "nanoid";

export async function postUrls(req, res) {
  try {
    let { session, urlId } = res.locals;
    const { url } = req.body;
    const shortUrl = nanoid(10);
    if (!urlId.rows[0]) {
      await connection.query(`INSERT INTO urls (url) VALUES ('${url}')`);
    }
    urlId = await connection.query(`SELECT id FROM urls WHERE url='${url}'`);
    const userId = session;
    await connection.query(
      `INSERT INTO "userUrl" ("urlId","shortUrl","visitCount","userId") VALUES (${urlId.rows[0].id},'${shortUrl}',0,'${userId.rows[0].id}')`
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function getOneUrl(req, res) {
  try {
    let { result } = res.locals;
    return res.send(result.rows[0]).status(200);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function putShortUrl(req, res) {
  try {
    let { resultUserUrl } = res.locals;
    await connection.query(
      `UPDATE "userUrl" SET "visitCount"=${
        Number(resultUserUrl.rows[0].visitCount) + 1
      } WHERE id =${resultUserUrl.rows[0].id}`
    );
    return res.redirect(200, resultUserUrl.rows[0].url);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function getMyUrls(req, res) {
  try {
    const { session } = res.locals;
    const userId = session;
    const existUserId = await connection.query(
      `SELECT users.id AS id FROM users WHERE users.id=${userId.rows[0].id}`
    );
    if (existUserId.rows[0]) {
      return res.sendStatus(404);
    }
    const resultUserUrls = await connection.query(
      `SELECT users.id AS id , name , SUM("userUrl"."visitCount") 
      AS "visitCount", json_agg(json_build_object('id',"userUrl".id ,'shortUrl',"userUrl"."shortUrl",'url',urls.url,'visitCount',"userUrl"."visitCount")) AS "shortenedUrls" 
      FROM users 
      JOIN "userUrl" ON "userUrl"."userId"=users.id 
      JOIN urls ON "userUrl"."urlId"=urls.id
      WHERE users.id=$1
      GROUP BY users.id`,
      [userId.rows[0].id]
    );
    return res.send(resultUserUrls.rows[0]).status(200);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function dellUrls(req, res) {
  try {
    const { session } = res.locals;
    const userId = session;
    const { id } = req.params;
    await connection.query(
      `DELETE FROM "userUrl" WHERE id = $1 AND "userId"=${userId.rows[0].id}`,
      [id]
    );
    return res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function getRanking(req, res) {
  try {
    const ranking = await connection.query(
      `SELECT users.id AS id, users.name AS name, COUNT("userUrl".id) AS "linksCount", SUM("userUrl"."visitCount") AS "visitCount"
      FROM users 
      JOIN "userUrl" ON "userUrl"."userId"=users.id 
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10`
    );
    return res.send(ranking.rows).status(200);
  } catch (err) {
    return res.sendStatus(500);
  }
}
