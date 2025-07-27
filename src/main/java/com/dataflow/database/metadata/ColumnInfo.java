package com.dataflow.database.metadata;

import lombok.Data;

@Data
public class ColumnInfo {
    private String name;
    private String dataType;
    private boolean nullable;
    private boolean primaryKey;
}
