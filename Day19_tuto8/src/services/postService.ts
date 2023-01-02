import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel.js"
import { postCreate } from "../interfaces/postInterface.js";
import {validationResult} from "express-validator"
import { logger } from "../logger/logger.js";


/**
 * get post service.
 * @param req 
 * @param res 
 * @param next 
 */

export const getPostService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let condition: any = { deleted_at: null };
    const posts = await Post.find(condition);
    res.json({
      data: posts,
      status: 1
    });
  }catch (err: any) {
    logger.error('GET Post API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ message: 'GET Post API Error', status: 1 });
  }
}


/**
 * create post service
 * @param req 
 * @param res 
 * @param next 
 */

export const createPostService = async (req: Request, res: Response, next: NextFunction) => { 
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed!");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }
    const postInsert: postCreate = {
      title: req.body.title,
      description: req.body.description
    }
    const post = new Post(postInsert);
    const result = await post.save();
    res
      .status(201)
      .json({ message: "Created Successfully!", data: result, status: 1 });
  } catch(err:any) {
    logger.error('Create Post API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ message: 'Create Post API Error', status: 1 });
  }
}

/**
 * get post data with postId service.
 * @param req 
 * @param res 
 * @param next 
 */
export const findPostService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error: any = Error("Not Found!");
      error.statusCode = 404;
      throw error;
    }
    res.json({ data: post, status: 1 });
  } catch (err: any) {
    logger.error('GET Post with id API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res
      .status(404)
      .json({ message: "GET Post with id API Error", status: 0 });
  }
}

/**
 * update post with id.
 * @param req 
 * @param res 
 * @param _next 
 */
export const updatePostService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed!");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }
    const post: any = await Post.findById(req.params.id);
    if (!post) {
      const error: any = new Error("Not Found!");
      error.statusCode = 404;
      throw error;
    }
    post.title = req.body.title;
    post.description = req.body.description;
    const result = await post.save();
    res.json({ message: "Updated Successfully!", data: result, status: 1 });
  } catch (err: any) {
    logger.error('Update Post API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ data: 'Update Post API Error', status: 1 });
  }
};


/**
 * delete post with id.
 * @param req
 * @param res 
 * @param next 
 */
export const deletePostService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const post: any = await Post.findById(req.params.id);
    if (!post) {
      const error: any = new Error("Not Found!");
      error.statusCode = 404;
      throw error;
    }
    post.deleted_at = new Date();
    await post.save();
    res.json({ message: "Deleted Successfully!", status: 1 });
  } catch (err: any) {
    logger.error('Delete Post API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ data: 'Delete Post API Error', status: 1 });
  }
};

/**
 * find title with keyword service.
 * @param req 
 * @param res 
 * @param _next 
 */
export const findByNameService = async (
  req: any,
  res: Response,
  _next: NextFunction
) => {
  try {
    let condition: any = { title: { '$regex': req.body.title, '$options': 'i' }, deleted_at: null };
    const posts = await Post.find(condition);
    res.json({ data: posts, status: 1 });
  } catch (err: any) {
    logger.error('Search Post with title keyword API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ data: 'Search Post with title keyword API Error', status: 1 });
  }
}