import connection from "../dbStrategy/postgres.js";
import { nanoid } from "nanoid";

export async function postUrls(req, res) {
  try {
    const { session } = res.locals;
    const { url } = req.body;
    const shortUrl = nanoid(10);
    await connection.query(`INSERT INTO urls (url) VALUES ('${url}')`);
    const userId = session;
    const urlId = await connection.query(
      `SELECT id FROM urls WHERE url='${url}'`
    );
    await connection.query(
      `INSERT INTO "userUrl" ("urlId","shortUrl","visitCount","userId") VALUES (${urlId.rows[0].id},'${shortUrl}',0,'${userId.rows[0].id}')`
    );
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function getOneUrl(req, res) {
  try {
    const { id } = req.params;
    const result = await connection.query(
      `SELECT "userUrl".id AS id ,"shortUrl",url FROM "userUrl" JOIN urls ON "userUrl"."userId"=urls.id WHERE "userUrl".id = $1`,
      [id]
    );
    return res.send(result.rows[0]).status(200);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function putShortUrl(req, res) {
  try {
    const { shortUrl } = req.params;
    const resultUserUrl = await connection.query(
      `SELECT "userUrl".id AS id, "userUrl"."visitCount" AS "visitCount" , url FROM "userUrl"  JOIN urls ON "userUrl"."urlId"=urls.id WHERE "shortUrl"= $1`,
      [shortUrl]
    );
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
    return res.sendStatus(200);
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
