import {
  postUrls,
  getOneUrl,
  putShortUrl,
  getMyUrls,
  dellUrls,
  getRanking,
} from "../controllers/urlsController.js";
import { Router } from "express";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.post("/urls/shorten", authorization, postUrls);
router.get("/urls/me", authorization, getMyUrls);
router.get("/urls/:id", getOneUrl);
router.put("/urls/open/:shortUrl", putShortUrl);
router.delete("/urls/:id", authorization, dellUrls);
router.get("/ranking", getRanking);

export default router;
