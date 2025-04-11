import express from "express";
import {
  AddComment,
  create_article,
  DeleteComment,
  get_all_article,
  updateLike,
  updateVisiblity,
} from "../controller/article.js";

const router = express.Router();

router.get("/all_articles", get_all_article);

router.post("/add_article", create_article);

router.patch("/update_article_visiblity", updateVisiblity);

router.put("/update_article_like", updateLike);

router.post("/add_article_comment", AddComment);

router.post("/:ArticleId/:CommentId/:UserId", DeleteComment);

// router.get("/view_single_article");
// router.post("/request_visiblity");
// router.post("/noti_for_permission");

// router.delete("/delete_article");

export { router as ArticleRouter };
