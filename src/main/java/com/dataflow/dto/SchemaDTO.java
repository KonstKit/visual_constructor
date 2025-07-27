package com.dataflow.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SchemaDTO {
    private List<TableDTO> tables = new ArrayList<>();
}
