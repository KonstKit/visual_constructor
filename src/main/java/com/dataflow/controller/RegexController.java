package com.dataflow.controller;

import com.dataflow.dto.RegexTestRequest;
import com.dataflow.dto.RegexTestResponse;
import com.dataflow.dto.RegexValidateRequest;
import com.dataflow.regex.RegexService;
import com.dataflow.regex.RegexTemplateLibrary;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/regex")
public class RegexController {

    private final RegexService service;
    private final RegexTemplateLibrary library;

    public RegexController(RegexService service, RegexTemplateLibrary library) {
        this.service = service;
        this.library = library;
    }

    @PostMapping("/validate")
    public Map<String, Boolean> validate(@RequestBody RegexValidateRequest request) {
        boolean valid = service.validateRegex(request.getPattern());
        return Map.of("valid", valid);
    }

    @PostMapping("/test")
    public RegexTestResponse test(@RequestBody RegexTestRequest request) {
        RegexTestResponse resp = new RegexTestResponse();
        resp.setResults(service.testRegex(request.getPattern(), request.getTestCases()));
        return resp;
    }

    @GetMapping("/templates")
    public Map<String, String> templates() {
        return library.getTemplates();
    }
}
