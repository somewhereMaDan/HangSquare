import express from "express";
import { create_article, get_all_article, updateVisiblity } from "../controller/article.js";

const router = express.Router();

router.get("/all_articles", get_all_article);

router.get("/view_single_article");

router.post("/add_article", create_article);

router.patch('/update_article_visiblity', updateVisiblity)

router.post("/request_visiblity");
router.post("/noti_for_permission");

router.delete("/delete_article");


export { router as ArticleRouter };
