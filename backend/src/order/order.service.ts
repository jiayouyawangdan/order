import { Injectable } from '@nestjs/common';
import { response } from '../controllers/common';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../order.db');
const initSql =
  'CREATE TABLE  if not exists orders(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,amount REAL not null,desc TEXT)';

enum Constant {
  'OPERATION_MSG' = '操作成功',
}
@Injectable()
export class OrderService {
  async listOrder(body: any) {
    db.run(initSql);
    const sql = 'select * from orders order by id desc';
    const data = await new Promise((resolve) => {
      db.all(sql, function (err, rows) {
        if (err) {
          return response(false, -1, '查询失败', {
            msg: '查询失败',
          });
        }

        resolve(rows);
      });
    });
    return response(true, 200, '查询成功', data);
  }
  async listOrderWithPagination(pageNumber: any, keyword = '') {
    db.run(initSql);
    const sql = keyword
      ? `select * from orders where name LIKE  '%${keyword}%' order by id desc LIMIT 10 OFFSET ${
          10 * pageNumber
        }`
      : `select * from orders order by id desc LIMIT 10 OFFSET ${
          10 * pageNumber
        }`;
    const countSql = keyword
      ? `select count(*) as count from orders where name LIKE '%${keyword}%'`
      : `select count(*) as count from orders`;

    console.log('pageNumber is ' + pageNumber, 'keyword is ' + keyword);
    console.log(countSql);
    const data = await new Promise((resolve) => {
      db.all(sql, function (err, rows) {
        if (err) {
          return response(false, -1, '查询失败', {
            msg: '查询失败',
          });
        }

        resolve(rows);
      });
    });
    const total = await new Promise((resolve) => {
      db.all(countSql, function (err, res) {
        if (err) {
          return response(false, -1, '查询失败', {
            msg: '查询失败',
          });
        }
        console.log(res, '@@@@@@@');
        resolve(res[0].count);
      });
    });
    return response(true, 200, '查询成功', { total, data });
  }

  addOrder(body: any) {
    db.run(initSql);
    const sql = 'insert into orders(name,desc,amount) values(?,?,?)';
    const data = ['订单名称' + Math.random(), body.desc, Math.random()];
    db.run(sql, data, function (err) {
      if (err)
        return response(false, -1, '添加订单失败', { msg: '添加订单失败' });
    });
    return response(true, 200, Constant.OPERATION_MSG, {
      msg: Constant.OPERATION_MSG,
    });
  }

  updateOrder(body: any) {
    const sql = 'update orders set desc = ? where id = ?';
    const data = [body.desc, body.id];
    db.run(sql, data, function (err) {
      if (err)
        return response(false, -1, '更新订单失败', { msg: '更新订单失败' });
    });
    return response(true, 200, Constant.OPERATION_MSG, {
      msg: Constant.OPERATION_MSG,
    });
  }

  delOrder(body: any) {
    const sql = 'delete from orders where id = ?';
    const data = [body.id];
    db.run(sql, data, function (err) {
      if (err)
        return response(false, -1, '删除订单失败', { msg: '删除订单失败' });
    });
    return response(true, 200, Constant.OPERATION_MSG, {
      msg: Constant.OPERATION_MSG,
    });
  }
}
