declare module 'expo-sqlite' {
  export type SQLResultSet = {
    rows: {
      _array: Array<any>;
    };
  };

  export type SQLTransaction = {
    executeSql: (
      sqlStatement: string,
      parameters?: any[],
      successCallback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: Error) => void
    ) => void;
  };

  export type Database = {
    transaction: (callback: (transaction: SQLTransaction) => void) => void;
    executeSql: (
      sqlStatement: string,
      parameters?: any[],
      successCallback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: Error) => void
    ) => void;
  };

  export function openDatabase(databaseName: string): Database;
}
