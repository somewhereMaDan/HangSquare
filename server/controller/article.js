import { ArticleModal } from "../models/Article.js";
import { UserModel } from "../models/Users.js";

export const get_all_article = async (req, res) => {
  try {
    const articles = await ArticleModal.find({});
    return res
      .status(200)
      .json({ message: "Articles Fetched", articles: articles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const create_article = async (req, res) => {
  try {
    // if (!req.body || typeof req.body !== Object) {
    //   return res.status(400).json({ message: "invalid request body" });
    // }
    const { Owner_id, Topic, ArticleContent, PicturePath, Visiblity } =
      req.body;
    if (!Owner_id)
      return res.status(400).json({ message: "Owner Id is required!" });
    if (!Topic) return res.status(400).json({ message: "Topic is required!" });

    const TempUser = await UserModel.find({ _id: Owner_id });
    const user = await UserModel.findById(Owner_id);

    let all_users_ids;
    if (Visiblity === "ALL" || !Visiblity) {
      const ALL_Users = await UserModel.find({}, "_id").lean();
      all_users_ids = ALL_Users.map((user) => user._id.toString());
    } else if (Visiblity === "FRIENDS") {
      all_users_ids = user.Friends;
      console.log("user_friends: ", all_users_ids);
    }

    const article = await ArticleModal.create({
      Owner: Owner_id,
      Topic: Topic,
      ArticleContent: ArticleContent,
      PicturePath: PicturePath || [],
      Visiblity:
        Visiblity && Visiblity.length > 0
          ? [
              {
                VisiblityType: Visiblity,
                users: all_users_ids,
              },
            ]
          : [
              {
                VisiblityType: "ALL",
                users: all_users_ids,
              },
            ],
    });

    user.OwnArticles.push(article._id);
    await user.save();

    return res
      .status(200)
      .json({ message: "Article created successfully", article: article });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
