/**
 * log API
 */
import { Request, Response } from "express";
import { default as https } from "https";

import { httpsClient } from "../util/https-client";

const defaultProjectConfig = {
  projectName: "angular-cow-frontend",
  type: "commits",
  token: "9791ad022fa22dc6cb47ed293d1226de7e1578a5",
  // 默认参数
  query: {
    page: 1, // 当前页码
    per_page: 20 // 一页的数量
  }
};

const defaultOptions: https.RequestOptions = {
  hostname: "api.github.com",
  path: "/repos/yujinpan",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
  }
};

// /api/log
export const log = (req: Request, res: Response) => {
  httpsClient
    .get(createOptions(defaultOptions, defaultProjectConfig, req.query))
    .then((result) => {
      if (result.state && result.data instanceof Array) {
        let author, commit;
        result.data = result.data.map((item: any) => {
          author = item.author;
          commit = item.commit;
          return {
            author: {
              name: author.login,
              url: author.html_url,
              avatar_url: author.avatar_url
            },
            date: commit.committer.date,
            message: commit.message,
            url: commit.url
          };
        });
      }
      res.json(result);
    });
};

/**
 * 创建 get 请求的 options
 * @param defaultOptions 默认配置
 * @param defaultProjectConfig 默认项目
 * @param query 查询参数
 */
function createOptions(
  defaultOptions: https.RequestOptions,
  defaultProjectConfig: any,
  query: any
) {
  // 将参数生成 query
  const querys = Object.assign({}, defaultProjectConfig.query, query);
  let search: string[] | string = [];
  for (const key in querys) {
    search.push(`${key}=${querys[key]}`);
  }
  search = search.join("&");

  // 返回options
  return Object.assign({}, defaultOptions, {
    path: `${defaultOptions.path}/${defaultProjectConfig.projectName}/${
      defaultProjectConfig.type
    }?${search}`,
    auth: `${defaultProjectConfig.token}`
  });
}
