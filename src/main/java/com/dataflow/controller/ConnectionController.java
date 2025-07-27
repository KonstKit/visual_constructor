package com.dataflow.controller;

import com.dataflow.model.Connection;
import com.dataflow.repository.ConnectionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionRepository repository;

    public ConnectionController(ConnectionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Connection> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Connection> findById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Connection create(@RequestBody Connection connection) {
        return repository.save(connection);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Connection> update(@PathVariable Long id, @RequestBody Connection connection) {
        Optional<Connection> existing = repository.findById(id);
        if (existing.isPresent()) {
            Connection conn = existing.get();
            conn.setName(connection.getName());
            conn.setDatabaseType(connection.getDatabaseType());
            conn.setConnectionString(connection.getConnectionString());
            conn.setCreatedAt(connection.getCreatedAt());
            conn.setUpdatedAt(connection.getUpdatedAt());
            Connection saved = repository.save(conn);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
