package com.dataflow.controller;

import com.dataflow.dto.RegexTestRequest;
import com.dataflow.dto.RegexTestResponse;
import com.dataflow.dto.RegexValidateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class RegexControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void validateEndpoint() {
        RegexValidateRequest req = new RegexValidateRequest();
        req.setPattern("a+");
        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/regex/validate", req, Map.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("valid")).isEqualTo(true);
    }

    @Test
    void testEndpoint() {
        RegexTestRequest req = new RegexTestRequest();
        req.setPattern("a+");
        req.setTestCases(List.of("a", "b"));
        ResponseEntity<RegexTestResponse> resp = restTemplate.postForEntity("/api/regex/test", req, RegexTestResponse.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getResults()).containsExactly(true, false);
    }

    @Test
    void templatesEndpoint() {
        ResponseEntity<Map> resp = restTemplate.getForEntity("/api/regex/templates", Map.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(((Map<?,?>)resp.getBody()).size()).isGreaterThan(0);
    }
}
