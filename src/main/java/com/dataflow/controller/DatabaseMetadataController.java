package com.dataflow.controller;

import com.dataflow.database.ConnectionConfig;
import com.dataflow.database.metadata.DatabaseSchema;
import com.dataflow.database.metadata.DatabaseType;
import com.dataflow.database.metadata.CachedDatabaseMetadataService;
import com.dataflow.dto.SchemaDTO;
import com.dataflow.exception.ResourceNotFoundException;
import com.dataflow.mapping.DatabaseSchemaMapper;
import com.dataflow.model.Connection;
import com.dataflow.repository.ConnectionRepository;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/connections/{id}")
public class DatabaseMetadataController {

    private final ConnectionRepository repository;
    private final CachedDatabaseMetadataService service;
    private final DatabaseSchemaMapper mapper;

    public DatabaseMetadataController(ConnectionRepository repository,
                                      CachedDatabaseMetadataService service,
                                      DatabaseSchemaMapper mapper) {
        this.repository = repository;
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping("/extract-schema")
    public SchemaDTO extract(@PathVariable Long id) throws SQLException {
        Connection connection = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found"));
        DatabaseSchema schema = service.extractSchema(toConfig(connection));
        return mapper.toDto(schema);
    }

    @GetMapping("/schema")
    public SchemaDTO getSchema(@PathVariable Long id) throws SQLException {
        Connection connection = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found"));
        DatabaseSchema schema = service.extractSchema(toConfig(connection));
        return mapper.toDto(schema);
    }

    private ConnectionConfig toConfig(Connection connection) {
        ConnectionConfig config = new ConnectionConfig();
        config.setDatabaseType(DatabaseType.valueOf(connection.getDatabaseType()));
        config.setUrl(connection.getConnectionString());
        Pattern userP = Pattern.compile("[?;]user=([^;&]+)", Pattern.CASE_INSENSITIVE);
        Pattern passP = Pattern.compile("[?;]password=([^;&]*)", Pattern.CASE_INSENSITIVE);
        Matcher m = userP.matcher(connection.getConnectionString());
        if (m.find()) {
            config.setUsername(m.group(1));
        }
        Matcher mp = passP.matcher(connection.getConnectionString());
        if (mp.find()) {
            config.setPassword(mp.group(1));
        }
        return config;
    }
}
