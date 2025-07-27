package com.dataflow.database.metadata;

import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class DatabaseMetadataExtractorFactory {
    private final Map<DatabaseType, DatabaseMetadataExtractor> extractorMap;

    public DatabaseMetadataExtractorFactory(List<DatabaseMetadataExtractor> extractors) {
        this.extractorMap = new EnumMap<>(DatabaseType.class);
        for (DatabaseMetadataExtractor extractor : extractors) {
            if (extractor instanceof PostgreSQLMetadataExtractor) {
                extractorMap.put(DatabaseType.POSTGRESQL, extractor);
            }
            // other extractors can be added here
        }
    }

    public DatabaseMetadataExtractor getExtractor(DatabaseType type) {
        DatabaseMetadataExtractor extractor = extractorMap.get(type);
        if (extractor == null) {
            throw new IllegalArgumentException("No extractor for type: " + type);
        }
        return extractor;
    }
}
