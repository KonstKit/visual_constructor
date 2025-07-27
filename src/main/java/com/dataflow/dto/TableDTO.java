package com.dataflow.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TableDTO {
    private String name;
    private List<ColumnDTO> columns = new ArrayList<>();
}
