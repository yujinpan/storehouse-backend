/**
 * user API
 */
import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

import User, { UserModel } from "../models/User";

// token过期时间2天
const expiresIn = 60 * 60 * 24 * 2;

// /api/register
export const register = (req: Request, res: Response) => {
  const params: UserModel = req.body;

  // 参数不全
  if (!params.username || !params.password || !params.avatar) {
    return res.json({
      state: false,
      message: "Incomplete parameters."
    });
  }

  // 查找是否重复
  findUser(params.username).then((user) => {
    if (user) {
      return res.json({
        state: false,
        message: "User already exists."
      });
    } else {
      params.lastTime = new Date().toLocaleString();
      const user = new User(params);
      user.save((err: any) => {
        if (err) {
          return res.json({
            state: false,
            message: "User store failed."
          });
        } else {
          return res.json({
            state: true,
            data: createLoginData(params)
          });
        }
      });
    }
  });
};

// /api/login
export const login = (req: Request, res: Response) => {
  const params = req.body;

  // 参数不全
  if (!params.username || !params.password) {
    return res.json({
      state: false,
      message: "Incomplete parameters."
    });
  }

  // 查找用户
  findUser(params.username).then((user) => {
    if (user) {
      if (params.password === user.password) {
        // 更新最后登陆时间
        User.updateOne(
          { _id: user._id },
          { $set: { lastTime: new Date().toLocaleString() } },
          (err, res) => {
            console.log(err, res);
          }
        );
        // 登陆成功
        return res.json({
          state: true,
          data: createLoginData(user)
        });
      } else {
        return res.json({
          state: false,
          message: "Username or password is incorrect."
        });
      }
    } else {
      return res.json({
        state: false,
        message: "Username or password is incorrect."
      });
    }
  });
};

// findUser
function findUser(username: string): Promise<any> {
  return new Promise((resolve) => {
    User.findOne({ username }, (err: any, user: UserModel) => {
      if (err) {
        resolve();
      }
      if (user) {
        resolve(user);
      } else {
        resolve();
      }
    });
  });
}

// 生成登陆的返回信息
function createLoginData(user: UserModel) {
  return {
    token: createLoginToken(user.username),
    expireAt: expiresIn * 1000 + new Date().getTime(),
    username: user.username,
    avatar: user.avatar
  };
}

// 生成登陆token
function createLoginToken(data: any) {
  const token = jsonwebtoken.sign(
    {
      exp: Date.now() / 1000 + expiresIn,
      data
    },
    process.env.TOKEN_SECRET
  );
  return token;
}
