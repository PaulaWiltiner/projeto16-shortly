import { signUpSchema, signInSchema } from "../schemas/userSchema.js";
import connection from "../dbStrategy/postgres.js";
import bcrypt from "bcrypt";

export async function signUpValidator(req, res, next) {
  const user = req.body;
  const validation = signUpSchema.validate(user);
  if (validation.error) {
    return res.sendStatus(422); // bad request
  }
  const sameEmail = await connection.query(
    `SELECT email FROM users WHERE email='${req.body.email}'`
  );
  if (sameEmail.rows[0]) {
    return res.sendStatus(409);
  }

  next();
}

export async function signInValidator(req, res, next) {
  const user = req.body;
  const validation = signInSchema.validate(user);
  if (validation.error) {
    return res.sendStatus(422); // bad request
  }
  const findOne = await connection.query(
    `SELECT email,password FROM users WHERE email='${req.body.email}'`
  );
  const userPassword = bcrypt.compareSync(
    user.password,
    findOne.rows[0] ? findOne.rows[0].password : ""
  );
  if (!findOne.rows[0] || !userPassword) {
    return res.sendStatus(401);
  }
}
