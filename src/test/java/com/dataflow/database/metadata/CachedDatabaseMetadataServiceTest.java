package com.dataflow.database.metadata;

import com.dataflow.database.ConnectionConfig;
import com.dataflow.database.metadata.DatabaseType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;

import com.dataflow.database.metadata.DatabaseMetadataExtractor;
import com.dataflow.database.metadata.DatabaseSchema;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class CachedDatabaseMetadataServiceTest {

    @Configuration
    static class TestConfig {
        @Bean
        CountingExtractor countingExtractor() {
            return new CountingExtractor();
        }

        @Bean
        DatabaseMetadataExtractorFactory factory(CountingExtractor extractor) {
            return new DatabaseMetadataExtractorFactory(java.util.List.of(extractor));
        }
    }

    static class CountingExtractor implements DatabaseMetadataExtractor {
        AtomicInteger count = new AtomicInteger();
        @Override
        public DatabaseSchema extractSchema(Connection connection) {
            count.incrementAndGet();
            return new DatabaseSchema();
        }
        @Override
        public boolean testConnection(ConnectionConfig config) { return true; }
    }

    @Autowired
    CachedDatabaseMetadataService service;
    @Autowired
    CountingExtractor extractor;

    @Test
    void cachingWorks() throws SQLException {
        ConnectionConfig config = new ConnectionConfig();
        config.setDatabaseType(DatabaseType.POSTGRESQL);
        config.setUrl("jdbc:h2:mem:testdb");
        config.setUsername("sa");
        config.setPassword("");

        service.extractSchema(config);
        service.extractSchema(config);
        assertThat(extractor.count.get()).isEqualTo(1);
    }
}
