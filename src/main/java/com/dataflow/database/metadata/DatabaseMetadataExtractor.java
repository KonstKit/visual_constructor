package com.dataflow.database.metadata;

import com.dataflow.database.ConnectionConfig;

import java.sql.Connection;
import java.sql.SQLException;

public interface DatabaseMetadataExtractor {
    DatabaseSchema extractSchema(Connection connection) throws SQLException;
    boolean testConnection(ConnectionConfig config);
}
