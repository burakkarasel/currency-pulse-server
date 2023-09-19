import { Logger } from "@nestjs/common";
import { Pool, createPool } from "mysql";

export abstract class AbstractRepository {
  pool: Pool;
  protected logger: Logger;
  constructor(obj: any) {
    const { user, database, port, host, password } = obj;
    this.pool = createPool({
      user,
      database,
      port,
      host,
      password,
      connectionLimit: 10,
    });
  }

  async query(sql: string, args?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.query(sql, args ? args : undefined, (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        });
      });
    });
  }
}
