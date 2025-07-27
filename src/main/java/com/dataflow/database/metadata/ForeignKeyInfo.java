package com.dataflow.database.metadata;

import lombok.Data;

@Data
public class ForeignKeyInfo {
    private String columnName;
    private String referencedTable;
    private String referencedColumn;
}
