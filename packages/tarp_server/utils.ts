export async function testQueryPerformance() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    // 시간 측정 시작
    console.time('Query Execution Time');

    // 실제 쿼리 실행
    const result = await client.query(testQuery);

    // 시간 측정 종료
    console.timeEnd('Query Execution Time');

    // 결과 출력 또는 다른 테스트 로직 수행
    console.log(result.rows);
  } catch (error) {
    console.error('Error during query execution:', error);
  } finally {
    await client.end();
  }
}
