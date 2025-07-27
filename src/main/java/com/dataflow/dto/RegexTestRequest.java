package com.dataflow.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegexTestRequest {
    private String pattern;
    private List<String> testCases;
}
