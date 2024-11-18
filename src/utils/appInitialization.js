export async function tableExistsHasRecords(db, tableName) {
  try {
    const count = await db.table(tableName).count();
    return count > 0;
  } catch (error) {
    if (error.name === "NoSuchTable") {
      return false;
    }
    throw error;
  }
}
