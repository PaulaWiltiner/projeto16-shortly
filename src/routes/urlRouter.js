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
import {
  urlShortenValidator,
  urlOneValidator,
  shortUrlValidator,
  dellUrlValidator,
} from "../middlewares/urlValidator.js";

const router = Router();

router.post("/urls/shorten", authorization, urlShortenValidator, postUrls);
router.get("/urls/me", authorization, getMyUrls);
router.get("/urls/:id", urlOneValidator, getOneUrl);
router.put("/urls/open/:shortUrl", shortUrlValidator, putShortUrl);
router.delete("/urls/:id", authorization, dellUrlValidator, dellUrls);
router.get("/ranking", getRanking);

export default router;
