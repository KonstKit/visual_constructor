package com.dataflow.database.metadata;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TableInfo {
    private String name;
    private List<ColumnInfo> columns = new ArrayList<>();
    private List<ForeignKeyInfo> foreignKeys = new ArrayList<>();
}
