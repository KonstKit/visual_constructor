package com.dataflow.database.metadata;

import com.dataflow.database.ConnectionConfig;
import com.dataflow.database.metadata.ColumnInfo;
import com.dataflow.database.metadata.TableInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@ExtendWith(SpringExtension.class)
public class PostgreSQLMetadataExtractorTest {

    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14-alpine");

    @Test
    void extractsSchema() throws Exception {
        try (Connection conn = DriverManager.getConnection(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE TABLE test_table (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL)");
        }

        ConnectionConfig config = new ConnectionConfig();
        config.setDatabaseType(DatabaseType.POSTGRESQL);
        config.setUrl(postgres.getJdbcUrl());
        config.setUsername(postgres.getUsername());
        config.setPassword(postgres.getPassword());

        try (Connection conn = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())) {
            PostgreSQLMetadataExtractor extractor = new PostgreSQLMetadataExtractor();
            DatabaseSchema schema = extractor.extractSchema(conn);
            assertThat(schema.getTables()).extracting("name").contains("test_table");
            TableInfo table = schema.getTables().stream()
                    .filter(t -> "test_table".equals(t.getName()))
                    .findFirst()
                    .orElseThrow();
            assertThat(table.getColumns()).extracting("name").contains("id", "name");
            assertThat(table.getColumns().stream().filter(ColumnInfo::isPrimaryKey).count()).isEqualTo(1);
        }
    }
}
