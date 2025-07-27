package com.dataflow.database.metadata;

import com.dataflow.database.ConnectionConfig;
import com.dataflow.database.metadata.DatabaseMetadataExtractor;
import com.dataflow.database.metadata.DatabaseSchema;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Service
public class CachedDatabaseMetadataService {
    private final DatabaseMetadataExtractorFactory factory;

    public CachedDatabaseMetadataService(DatabaseMetadataExtractorFactory factory) {
        this.factory = factory;
    }

    @Cacheable(value = "dbSchemas", key = "T(java.util.Objects).hash(#config.databaseType, #config.url, #config.username)")
    public DatabaseSchema extractSchema(ConnectionConfig config) throws SQLException {
        DatabaseMetadataExtractor extractor = factory.getExtractor(config.getDatabaseType());
        try (Connection conn = openConnection(config)) {
            return extractor.extractSchema(conn);
        }
    }

    private Connection openConnection(ConnectionConfig config) throws SQLException {
        if (config.getUsername() == null || config.getUsername().isEmpty()) {
            return DriverManager.getConnection(config.getUrl());
        }
        return DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword());
    }
}
