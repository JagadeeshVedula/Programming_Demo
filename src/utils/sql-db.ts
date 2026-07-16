export interface SqlDbConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export interface SqlClientLike {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T>;
  end?(): Promise<void> | void;
}

export type SqlClientFactory = (config: SqlDbConfig) => Promise<SqlClientLike>;

export async function connectToSqlDb(
  config: SqlDbConfig,
  clientFactory: SqlClientFactory
): Promise<SqlClientLike> {
  return clientFactory(config);
}

export async function runSqlQuery<T = unknown>(
  config: SqlDbConfig,
  sql: string,
  params: unknown[] = [],
  clientFactory: SqlClientFactory
): Promise<T> {
  const client = await connectToSqlDb(config, clientFactory);

  try {
    return await client.query<T>(sql, params);
  } finally {
    if (client.end) {
      await client.end();
    }
  }
}

export async function withSqlConnection<T>(
  config: SqlDbConfig,
  operation: (client: SqlClientLike) => Promise<T>,
  clientFactory: SqlClientFactory
): Promise<T> {
  const client = await connectToSqlDb(config, clientFactory);

  try {
    return await operation(client);
  } finally {
    if (client.end) {
      await client.end();
    }
  }
}

function escapeIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

export function buildFindDuplicateRecordsSql(tableName: string, columnName: string): string {
  return `SELECT ${escapeIdentifier(columnName)} AS column_name, COUNT(*) AS duplicate_count
FROM ${escapeIdentifier(tableName)}
GROUP BY ${escapeIdentifier(columnName)}
HAVING COUNT(*) > 1`;
}

export function buildHighestPricedProductSql(tableName: string, priceColumn = 'price'): string {
  return `SELECT *
FROM ${escapeIdentifier(tableName)}
ORDER BY ${escapeIdentifier(priceColumn)} DESC
LIMIT 1`;
}

export function buildCountTotalProductsSql(tableName: string): string {
  return `SELECT COUNT(*) AS total_products FROM ${escapeIdentifier(tableName)}`;
}

export function buildValidateInsertedRecordSql(
  tableName: string,
  idColumn = 'id',
  placeholder = '?'
): string {
  return `SELECT * FROM ${escapeIdentifier(tableName)} WHERE ${escapeIdentifier(idColumn)} = ${placeholder}`;
}

export async function findDuplicateRecords<T = unknown>(
  config: SqlDbConfig,
  tableName: string,
  columnName: string,
  clientFactory: SqlClientFactory
): Promise<T> {
  const sql = buildFindDuplicateRecordsSql(tableName, columnName);
  return runSqlQuery<T>(config, sql, [], clientFactory);
}

export async function getHighestPricedProduct<T = unknown>(
  config: SqlDbConfig,
  tableName: string,
  priceColumn = 'price',
  clientFactory: SqlClientFactory
): Promise<T> {
  const sql = buildHighestPricedProductSql(tableName, priceColumn);
  return runSqlQuery<T>(config, sql, [], clientFactory);
}

export async function countTotalProducts<T = unknown>(
  config: SqlDbConfig,
  tableName: string,
  clientFactory: SqlClientFactory
): Promise<T> {
  const sql = buildCountTotalProductsSql(tableName);
  return runSqlQuery<T>(config, sql, [], clientFactory);
}

export async function validateInsertedRecord<T = unknown>(
  config: SqlDbConfig,
  tableName: string,
  insertedId: unknown,
  clientFactory: SqlClientFactory,
  idColumn = 'id',
  placeholder = '?'
): Promise<T> {
  const sql = buildValidateInsertedRecordSql(tableName, idColumn, placeholder);
  return runSqlQuery<T>(config, sql, [insertedId], clientFactory);
}

export function createSqlDbUtility(clientFactory: SqlClientFactory) {
  return {
    connect: (config: SqlDbConfig) => connectToSqlDb(config, clientFactory),
    runQuery: <T = unknown>(config: SqlDbConfig, sql: string, params: unknown[] = []) =>
      runSqlQuery<T>(config, sql, params, clientFactory),
    withConnection: <T>(config: SqlDbConfig, operation: (client: SqlClientLike) => Promise<T>) =>
      withSqlConnection(config, operation, clientFactory)
  };
}
