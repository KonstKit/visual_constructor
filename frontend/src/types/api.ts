export interface Column {
  name: string;
  dataType: string;
  nullable: boolean;
  primaryKey: boolean;
}

export interface Table {
  name: string;
  columns: Column[];
  foreignKeys?: ForeignKey[];
}

export interface ForeignKey {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface Schema {
  tables: Table[];
}

export interface Connection {
  id: number;
  name: string;
  databaseType: string;
  connectionString: string;
  createdAt: string;
  updatedAt: string;
}
