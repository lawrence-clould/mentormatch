import {
  createPool,
  type Pool as MySqlPool,
  type PoolConnection,
  type ResultSetHeader,
} from "mysql2/promise";
import { Pool as PostgresPool, type PoolClient } from "pg";

export type SqlValue = string | number | boolean | Date | Buffer | null;
export type DatabaseDialect = "mysql" | "postgres";

interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  insertId?: number | string;
}

interface Queryable {
  query<T>(statement: string, values?: readonly SqlValue[]): Promise<QueryResult<T>>;
}

interface DatabaseConnection extends Queryable {
  release(): void;
}

interface DatabasePool extends Queryable {
  connect(): Promise<DatabaseConnection>;
}

const globalForDatabase = globalThis as typeof globalThis & {
  pool?: DatabasePool;
  dialect?: DatabaseDialect;
};

function toMysqlSql(statement: string): { sql: string; returnsId: boolean } {
  const returnsId = /\s+RETURNING id\s*$/i.test(statement);
  const sql = statement
    .replace(/\s+RETURNING id\s*$/i, "")
    .replace(/CURRENT_DATE\s*\+\s*INTERVAL\s+'(\d+)\s+months?'/gi, "DATE_ADD(CURRENT_DATE, INTERVAL $1 MONTH)")
    .replace(
      /INSERT INTO courses(\s*\(course_code,\s*course_name\)[\s\S]*?)\s+ON CONFLICT \(course_code\) DO NOTHING/i,
      "INSERT IGNORE INTO courses$1",
    );
  return { sql, returnsId };
}

async function executeMysqlQuery<T>(
  connection: MySqlPool | PoolConnection,
  statement: string,
  values: readonly SqlValue[] = [],
): Promise<QueryResult<T>> {
  const { sql, returnsId } = toMysqlSql(statement);
  const [result] = await connection.query(sql, [...values]);
  if (Array.isArray(result)) {
    return { rows: result as T[], rowCount: result.length };
  }

  const header = result as ResultSetHeader;
  const rows = returnsId && header.insertId
    ? [{ id: String(header.insertId) } as T]
    : [];
  return { rows, rowCount: header.affectedRows, insertId: header.insertId };
}

function toPostgresSql(statement: string): string {
  let parameterIndex = 0;
  return statement.replace(/\?/g, () => `$${++parameterIndex}`);
}

async function executePostgresQuery<T>(
  connection: PostgresPool | PoolClient,
  statement: string,
  values: readonly SqlValue[] = [],
): Promise<QueryResult<T>> {
  const result = await connection.query(toPostgresSql(statement), [...values]);
  const insertId = result.rows[0]?.id;
  return {
    rows: result.rows as T[],
    rowCount: result.rowCount ?? result.rows.length,
    ...(insertId === undefined ? {} : { insertId: String(insertId) }),
  };
}

export function getPool(): DatabasePool {
  if (globalForDatabase.pool) {
    return globalForDatabase.pool;
  }

  if (process.env.DATABASE_URL) {
    const postgres = new PostgresPool({ connectionString: process.env.DATABASE_URL });
    const pool: DatabasePool = {
      query: <T>(statement: string, values?: readonly SqlValue[]) =>
        executePostgresQuery<T>(postgres, statement, values),
      connect: async () => {
        const connection = await postgres.connect();
        return {
          query: <T>(statement: string, values?: readonly SqlValue[]) =>
            executePostgresQuery<T>(connection, statement, values),
          release: () => connection.release(),
        };
      },
    };
    globalForDatabase.pool = pool;
    globalForDatabase.dialect = "postgres";
    return pool;
  }

  const mysql = createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? "3306"),
    database: process.env.DB_NAME ?? "mentormatch",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
  });
  const pool: DatabasePool = {
    query: <T>(statement: string, values?: readonly SqlValue[]) =>
      executeMysqlQuery<T>(mysql, statement, values),
    connect: async () => {
      const connection = await mysql.getConnection();
      return {
        query: <T>(statement: string, values?: readonly SqlValue[]) =>
          executeMysqlQuery<T>(connection, statement, values),
        release: () => connection.release(),
      };
    },
  };
  globalForDatabase.pool = pool;
  globalForDatabase.dialect = "mysql";
  return pool;
}

export function getDatabaseDialect(): DatabaseDialect {
  getPool();
  return globalForDatabase.dialect ?? "mysql";
}
