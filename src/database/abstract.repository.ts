import { Logger } from "@nestjs/common";
import * as mysql from "mysql";

export abstract class AbstractRepository {
  pool: mysql.Pool;
  protected abstract logger: Logger;
  constructor(obj: any) {
    const { user, database, port, host, password } = obj;
    this.initializePool(user, password, database, host, port);
  }

  private async initializePool(
    user: string,
    password: string,
    database: string,
    host: string,
    port: number,
  ): Promise<void> {
    this.pool = mysql.createPool({
      user,
      database,
      port,
      host,
      password,
      connectionLimit: 10,
    });
    console.log(this.pool);
  }

  async query(sql: string, args?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        console.log("error: ", err);
        console.log("connection: ", conn);
        if (err) {
          reject(err);
        }
        conn.query(sql, args, (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        });
        conn.release();
      });
    });
  }
}
