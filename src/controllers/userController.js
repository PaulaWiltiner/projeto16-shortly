import connection from "../dbStrategy/postgres.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ('${name}','${email}', '${passwordHash}');`
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  try {
    const token = uuidv4();
    const userId = await connection.query(
      `SELECT users.id FROM users WHERE email = '${req.body.email}'`
    );
    await connection.query(
      `INSERT INTO sessions ("userId",token) VALUES (${userId.rows[0].id},'${token}');`
    );
    return res.status(200).send({
      userId: userId.rows[0].id,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function logOut(req, res) {
  try {
    const { authorization } = req.headers;
    const tokenAuth = authorization?.replace("Bearer ", "");
    await connection.query(`DELETE FROM sessions WHERE token='${tokenAuth}'`);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
}
