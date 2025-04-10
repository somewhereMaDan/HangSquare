import express from "express";
import { create_article, get_all_article } from "../controller/article.js";

const router = express.Router();

router.get("/all_articles", get_all_article);

router.get("/view_single_article");

router.post("/add_article", create_article);

router.delete("/delete_article");

router.patch("/edit_viewers");

router.post("/request_to_view");

router.post("/noti_for_permission");

export { router as ArticleRouter };
