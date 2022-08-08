import connection from "../dbStrategy/postgres.js";

async function validateUser(req, res, next) {
  const { authorization } = req.headers;
  const tokenAuth = authorization?.replace("Bearer ", "");
  const session = await connection.query(
    `SELECT sessions."userId" AS id FROM sessions WHERE  sessions.token='${tokenAuth}'`
  );
  if (!session.rows[0] || !tokenAuth) {
    return res.sendStatus(401);
  }
  res.locals.session = session;
  next();
}

export default validateUser;
