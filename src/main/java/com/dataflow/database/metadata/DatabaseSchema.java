package com.dataflow.database.metadata;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DatabaseSchema {
    private List<TableInfo> tables = new ArrayList<>();
}
