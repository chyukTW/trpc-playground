import dotenv from 'dotenv';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { Client } from 'pg';

dotenv.config();

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const opts = {
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USER,
};

const pg = new Client(opts);

(async () => {
  try {
    await pg.connect();
  } catch {
    console.error('DB 연동 중 에러 발생');
  }
})();

const db = drizzle(pg);

export const getAllWorkspaces = async () => {
  return db.select().from(pgTable('workspace', { id: serial('id'), name: text('name') }));
};

export const getAllMissions = async () => {
  return db.select().from(pgTable('mission', { date: timestamp('date'), id: serial('id') }));
};

export const getMissions = async ({
  end = new Date(),
  limit = 10,
  offset = 0,
  start = new Date(),
}: {
  end?: Date;
  limit?: number;
  offset?: number;
  start?: Date;
}) => {
  const table = pgTable('mission', {
    date: timestamp('date'),
    eventTime: timestamp('event_time'),
    id: serial('id'),
    info: jsonb('info'),
    roadMapId: serial('road_map_id'),
  });

  return db
    .select()
    .from(table)
    .limit(limit)
    .offset(offset)
    .where(and(gte(table.date, start), lte(table.date, end)));
};

export const getMissionsBySQL = async ({
  end = new Date(),
  limit = 10,
  offset = 0,
  start = new Date(),
}: {
  end?: Date;
  limit?: number;
  offset?: number;
  start?: Date;
}) => {
  const res = await pg.query(
    `
      select id, date, event_time, road_map_id, info
      from mission
      where date >= $1 AND date < $2
      order by id
      limit $3
      offset $4
      `,
    [start, end, limit, offset],
  );

  return res.rows;
};

// test area

export async function testDrizzlePerformance(rows: number) {
  const pg = new Client(opts);

  (async () => {
    try {
      await pg.connect();
    } catch {
      console.error('DB 연동 중 에러 발생');
    }
  })();

  const db = drizzle(pg);

  try {
    console.time(`🌀 query by drizzle ORM: ${rows}-rows`);

    const table = pgTable('mission', {
      date: timestamp('date'),
      eventTime: timestamp('event_time'),
      id: serial('id'),
      info: jsonb('info'),
      roadMapId: serial('road_map_id'),
    });

    const res = await db
      .select()
      .from(table)
      .limit(rows)
      .offset(0)
      .where(and(gte(table.date, new Date('2024-01-01')), lte(table.date, new Date('2024-01-30'))));

    console.timeEnd(`🌀 query by drizzle ORM: ${rows}-rows`);

    console.log(`len of result: ${res.length}`);
  } catch (error) {
    console.error('Error during query execution:', error);
  } finally {
    await pg.end();
  }
}

// testDrizzlePerformance(1000);
// testDrizzlePerformance(10000);
// testDrizzlePerformance(50000);
// testDrizzlePerformance(100000);

export async function testSQLPerformance(rows: number) {
  const pg = new Client(opts);

  (async () => {
    try {
      await pg.connect();
    } catch {
      console.error('DB 연동 중 에러 발생');
    }
  })();

  try {
    console.time(`🍎 query by SQL: ${rows}-rows`);

    const res = await pg.query(
      `
        select id, date, event_time, road_map_id, info 
        from mission
        where date >= $1 AND date < $2
        order by id
        limit $3
        offset 0
        `,
      [new Date('2024-01-01'), new Date('2024-01-30'), rows],
    );

    console.timeEnd(`🍎 query by SQL: ${rows}-rows`);

    console.log(`len of result: ${res.rowCount}`);
  } catch (error) {
    console.error('Error during query execution:', error);
  } finally {
    await pg.end();
  }
}

// testSQLPerformance(1000);
// testSQLPerformance(10000);
// testSQLPerformance(50000);
// testSQLPerformance(100000);

export const getMissionByID = async (id: string) => {
  const table = pgTable('mission', {
    date: timestamp('date'),
    eventTime: timestamp('event_time'),
    id: serial('id'),
    info: jsonb('info'),
    roadMapId: serial('road_map_id'),
  });

  return db
    .select()
    .from(table)
    .where(sql`${table.id} = ${id}`);
};

export async function testDrizzlePerformanceByID(label: number) {
  const pg = new Client(opts);

  (async () => {
    try {
      await pg.connect();
    } catch {
      console.error('DB 연동 중 에러 발생');
    }
  })();

  const db = drizzle(pg);

  try {
    console.time(`🌀 query by ID by - drizzle ORM(${label})`);

    const table = pgTable('mission', {
      date: timestamp('date'),
      eventTime: timestamp('event_time'),
      id: serial('id'),
      info: jsonb('info'),
      roadMapId: serial('road_map_id'),
    });

    const res = await db
      .select()
      .from(table)
      .where(sql`${table.id} = '2bc8F77D-D3cb-57eB-7DbD-FaeFF2594ff8'`);

    console.timeEnd(`🌀 query by ID by - drizzle ORM(${label})`);
  } catch (error) {
    console.error('Error during query execution:', error);
  } finally {
    await pg.end();
  }
}

// testDrizzlePerformanceByID(1);
// testDrizzlePerformanceByID(2);
// testDrizzlePerformanceByID(3);
// testDrizzlePerformanceByID(4);
// testDrizzlePerformanceByID(5);
// testDrizzlePerformanceByID(6);
// testDrizzlePerformanceByID(7);
// testDrizzlePerformanceByID(8);
// testDrizzlePerformanceByID(9);
// testDrizzlePerformanceByID(10);

export async function testSQLPerformanceByID(label: number) {
  const pg = new Client(opts);

  (async () => {
    try {
      await pg.connect();
    } catch {
      console.error('DB 연동 중 에러 발생');
    }
  })();

  try {
    console.time(`🍎 query by ID - SQL(${label})`);

    const res = await pg.query(
      `
        select id, date, event_time, road_map_id, info 
        from mission
        where id = '2bc8F77D-D3cb-57eB-7DbD-FaeFF2594ff8'
        `,
    );

    console.timeEnd(`🍎 query by ID - SQL(${label})`);
  } catch (error) {
    console.error('Error during query execution:', error);
  } finally {
    await pg.end();
  }
}

testSQLPerformanceByID(1);
testSQLPerformanceByID(2);
testSQLPerformanceByID(3);
testSQLPerformanceByID(4);
testSQLPerformanceByID(5);
testSQLPerformanceByID(6);
testSQLPerformanceByID(7);
testSQLPerformanceByID(8);
testSQLPerformanceByID(9);
testSQLPerformanceByID(10);
