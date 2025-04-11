import { ArticleModal } from "../models/Article.js";
import { UserModel } from "../models/Users.js";

export const get_all_article = async (req, res) => {
  try {
    const articles = await ArticleModal.find({});
    return res
      .status(200)
      .json({ message: "Articles Fetched", All_articles: articles });
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
    const {
      Owner_id,
      Topic,
      ArticleContent,
      PicturePath,
      Visiblity,
      CustomVisiblity,
    } = req.body;
    if (!Owner_id)
      return res.status(400).json({ message: "Owner Id is required!" });
    if (!Topic) return res.status(400).json({ message: "Topic is required!" });

    const user = await UserModel.findById(Owner_id);
    let all_users_ids;
    if (Visiblity === "ALL" || !Visiblity) {
      const ALL_Users = await UserModel.find({}, "_id").lean();
      all_users_ids = ALL_Users.map((user) => user._id.toString());
    } else if (Visiblity === "FRIENDS") {
      all_users_ids = user.Friends;
    } else if (Visiblity === "CUSTOM") {
      if (!CustomVisiblity || CustomVisiblity.length === 0) {
        return res.status(400).json({ message: "Please Select Users!" });
      }
      all_users_ids = CustomVisiblity;
    }

    const article = await ArticleModal.create({
      Owner: Owner_id,
      Topic: Topic,
      ArticleContent: ArticleContent,
      PicturePath: PicturePath || [],
      Visiblity:
        Visiblity && Visiblity.length > 0
          ? {
              VisiblityType: Visiblity,
              users: all_users_ids,
            }
          : {
              VisiblityType: "ALL",
              users: all_users_ids,
            },
    });

    user.OwnArticles.push(article._id);
    await user.save();

    return res
      .status(200)
      .json({ message: "Article created successfully", NewArticle: article });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// In frontend when Searching for user while granting visiblity, please use 'Get_all_user_info' so that
// we can show all the users while selection
export const updateVisiblity = async (req, res) => {
  try {
    const { VisiblityType, userList, ArticleId } = req.body;

    if (!VisiblityType) {
      return res.status(400).json({ message: "Visiblity Type is required" });
    }
    const article = await ArticleModal.findById(ArticleId).populate();

    if (article.Visiblity.VisiblityType === VisiblityType) {
      return res.status(200).json({ message: "No changed Applied!" });
    }
    const users = await UserModel.find({}, "_id").lean();
    const all_users_ids = users.map((user) => user._id);
    if (VisiblityType === "ALL") {
      article.Visiblity.VisiblityType = "ALL";
      article.Visiblity.users = all_users_ids;
    } else if (VisiblityType === "CUSTOM") {
      if (!userList) {
        return res.status(400).json({ message: "User List is not given!" });
      }
      article.Visiblity.VisiblityType = "CUSTOM";
      // In frontend we have to provide list of Custom UserList
      article.Visiblity.users = userList;
    } else if (VisiblityType === "FRIENDS") {
      if (!userList) {
        return res.status(400).json({ message: "User List is not given!" });
      }
      article.Visiblity.VisiblityType = "FRIENDS";
      article.Visiblity.users = userList;
    } else if (VisiblityType === "PRIVATE") {
      article.Visiblity.VisiblityType = "PRIVATE";
      article.Visiblity.users = article.Owner;
    }
    await article.save();
    return res
      .status(200)
      .json({ message: "Visiblity Updated", UpdatedArticle: article });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "updateVisiblity Error" });
  }
};

// export const requestVisiblity = async (req, res) => {
//   try {
//     // We have to implement SSE Notification for this and we need frontend to do it
//     const { reason, UserId, ArticleId } = req.body;
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "requestVisiblity Error" });
//   }
// };

export const updateLike = async (req, res) => {
  try {
    const { UserId, isLike, ArticleId } = req.body;
    if (!UserId || !isLike || !ArticleId) {
      return res
        .status(400)
        .json({ message: "UserID, isLike, and ArticleId is required" });
    }
    const article = await ArticleModal.findById(ArticleId);
    article.ArticleLikes.set(UserId, isLike);
    await article.save();
    return res
      .status(200)
      .json({ message: "Like Updated", UpdatedArticle: article });
  } catch (error) {
    console.log(error);
    return res.json(500).json({ message: "updateLike Error" });
  }
};

export const AddComment = async (req, res) => {
  try {
    const { UserId, FirstName, ArticleId, CommentText } = req.body;
    if (!UserId || !FirstName || !ArticleId || !CommentText) {
      return res.status(400).json({
        message: "UserID, username, ArticleId, CommentText is required",
      });
    }
    const article = await ArticleModal.findById(ArticleId);
    const newComment = {
      OwnerId: UserId,
      FirstName: FirstName,
      CommentText: CommentText,
      CreatedAt: new Date(),
    };
    article.ArticleComments = [...article.ArticleComments, newComment];
    await article.save();
    return res
      .status(200)
      .json({ message: "Comment Added!", UpdatedArticle: article });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "AddComment Error" });
  }
};

export const DeleteComment = async (req, res) => {
  try {
    const { ArticleId, CommentId, UserId } = req.params;
    const article = await ArticleModal.findById(ArticleId);
    article.ArticleComments.filter((comment) => {
      return (
        comment.CommentId.toString() !== CommentId.toString() &&
        comment.OwnerId === UserId
      );
    });
    await article.save();
    return res
      .status(200)
      .json({ message: "Comment Deleted!", UpdatedArticle: article });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "DeleteComment Error" });
  }
};
