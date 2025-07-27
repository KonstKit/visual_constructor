package com.dataflow.database.metadata;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class DatabaseModelsTest {
    @Test
    void columnInfoProperties() {
        ColumnInfo column = new ColumnInfo();
        column.setName("id");
        column.setDataType("integer");
        column.setNullable(false);
        column.setPrimaryKey(true);

        assertThat(column.getName()).isEqualTo("id");
        assertThat(column.getDataType()).isEqualTo("integer");
        assertThat(column.isNullable()).isFalse();
        assertThat(column.isPrimaryKey()).isTrue();
    }

    @Test
    void tableInfoProperties() {
        ColumnInfo column = new ColumnInfo();
        column.setName("id");
        TableInfo table = new TableInfo();
        table.setName("users");
        table.getColumns().add(column);
        ForeignKeyInfo fk = new ForeignKeyInfo();
        fk.setColumnName("role_id");
        fk.setReferencedTable("roles");
        fk.setReferencedColumn("id");
        table.getForeignKeys().add(fk);

        assertThat(table.getName()).isEqualTo("users");
        assertThat(table.getColumns()).hasSize(1);
        assertThat(table.getForeignKeys()).hasSize(1);
    }

    @Test
    void databaseSchemaHoldsTables() {
        TableInfo table = new TableInfo();
        table.setName("users");
        DatabaseSchema schema = new DatabaseSchema();
        schema.getTables().add(table);

        assertThat(schema.getTables()).hasSize(1);
        assertThat(schema.getTables().get(0).getName()).isEqualTo("users");
    }
}
