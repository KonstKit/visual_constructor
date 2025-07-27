package com.dataflow.database;

import com.dataflow.database.metadata.DatabaseType;
import lombok.Data;

@Data
public class ConnectionConfig {
    private DatabaseType databaseType;
    private String url;
    private String username;
    private String password;
}
