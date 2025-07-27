package com.dataflow.database.metadata;

import com.dataflow.database.ConnectionConfig;
import com.dataflow.database.util.JdbcUtils;
import org.springframework.stereotype.Component;


import java.sql.*;
import java.util.*;

@Component

public class PostgreSQLMetadataExtractor implements DatabaseMetadataExtractor {

    @Override
    public DatabaseSchema extractSchema(Connection connection) throws SQLException {
        DatabaseSchema schema = new DatabaseSchema();
        DatabaseMetaData metaData = connection.getMetaData();

        try (ResultSet tables = metaData.getTables(null, "public", "%", new String[]{"TABLE"})) {
            while (tables.next()) {
                String tableName = JdbcUtils.getString(tables, "TABLE_NAME");
                TableInfo table = new TableInfo();
                table.setName(tableName);

                Map<String, ColumnInfo> columnMap = new LinkedHashMap<>();
                try (ResultSet columns = metaData.getColumns(null, "public", tableName, null)) {
                    while (columns.next()) {
                        ColumnInfo column = new ColumnInfo();
                        column.setName(JdbcUtils.getString(columns, "COLUMN_NAME"));
                        String type = normalizeType(JdbcUtils.getString(columns, "TYPE_NAME"));
                        column.setDataType(type);
                        column.setNullable("YES".equals(JdbcUtils.getString(columns, "IS_NULLABLE")));
                        columnMap.put(column.getName(), column);
                    }
                }

                try (ResultSet pkRs = metaData.getPrimaryKeys(null, "public", tableName)) {
                    while (pkRs.next()) {
                        String colName = JdbcUtils.getString(pkRs, "COLUMN_NAME");
                        ColumnInfo col = columnMap.get(colName);
                        if (col != null) {
                            col.setPrimaryKey(true);
                        }
                    }
                }

                table.getColumns().addAll(columnMap.values());

                try (ResultSet fkRs = metaData.getImportedKeys(null, "public", tableName)) {
                    while (fkRs.next()) {
                        ForeignKeyInfo fk = new ForeignKeyInfo();
                        fk.setColumnName(JdbcUtils.getString(fkRs, "FKCOLUMN_NAME"));
                        fk.setReferencedTable(JdbcUtils.getString(fkRs, "PKTABLE_NAME"));
                        fk.setReferencedColumn(JdbcUtils.getString(fkRs, "PKCOLUMN_NAME"));
                        table.getForeignKeys().add(fk);
                    }
                }

                schema.getTables().add(table);
            }
        }

        return schema;
    }

    private String normalizeType(String typeName) {
        if (typeName == null) return "";
        switch (typeName.toLowerCase()) {
            case "int4":
            case "serial":
                return "INTEGER";
            case "int8":
            case "bigserial":
                return "BIGINT";
            case "bool":
                return "BOOLEAN";
            default:
                return typeName.toUpperCase();
        }
    }

    @Override
    public boolean testConnection(ConnectionConfig config) {
        try (Connection conn = DriverManager.getConnection(
                config.getUrl(), config.getUsername(), config.getPassword())) {
            return conn.isValid(2);
        } catch (SQLException e) {
            return false;
        }
    }
}
