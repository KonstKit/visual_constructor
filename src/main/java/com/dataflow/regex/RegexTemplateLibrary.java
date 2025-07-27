package com.dataflow.regex;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RegexTemplateLibrary {
    private final Map<String, String> templates = Map.of(
            "Email", "^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,6}$",
            "IPv4", "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$",
            "UUID", "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    );

    public Map<String, String> getTemplates() {
        return templates;
    }
}
