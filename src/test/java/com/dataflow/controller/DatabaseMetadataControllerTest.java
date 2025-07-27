package com.dataflow.controller;

import com.dataflow.dto.SchemaDTO;
import com.dataflow.model.Connection;
import com.dataflow.repository.ConnectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class DatabaseMetadataControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ConnectionRepository repository;

    @Autowired
    private DataSource dataSource;

    private Connection saved;

    @BeforeEach
    void setup() throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE TABLE sample(id INT PRIMARY KEY, name VARCHAR(50))");
        }
        Connection c = new Connection();
        c.setName("test");
        c.setDatabaseType("POSTGRESQL");
        c.setConnectionString("jdbc:h2:mem:testdb;MODE=PostgreSQL;user=sa;password=");
        saved = repository.save(c);
    }

    @Test
    void extractAndGet() {
        ResponseEntity<SchemaDTO> extract = restTemplate.postForEntity(
                "/api/connections/{id}/extract-schema", null, SchemaDTO.class, saved.getId());
        assertThat(extract.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(extract.getBody().getTables()).isNotEmpty();

        ResponseEntity<SchemaDTO> get = restTemplate.getForEntity(
                "/api/connections/{id}/schema", SchemaDTO.class, saved.getId());
        assertThat(get.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(get.getBody().getTables()).isNotEmpty();
    }

    @Test
    void notFound() {
        ResponseEntity<String> resp = restTemplate.postForEntity(
                "/api/connections/999/extract-schema", null, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
