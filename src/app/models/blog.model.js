import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    categories: [String],
    featuredImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "Status can either be Draft or Published",
      },
      required: true,
      default: "Draft",
    },
    reactions: {
      like: {
        type: Number,
        min: 0,
        default: 0,
      },
      dislike: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
