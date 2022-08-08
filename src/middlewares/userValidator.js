import userSchema from "../schemas/userSchema.js";

export function userValidator(req, res, next) {
  const user = req.body;
  const validation = userSchema.validate(user);
  if (validation.error) {
    return res.sendStatus(422); // bad request
  }
  const sameEmail = await connection.query(
    `SELECT email FROM users WHERE email='${req.body}'`
  );
  if(sameEmail){
    return res.sendStatus(409);
  }

  next();
}
