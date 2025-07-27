package com.dataflow.dto;

import lombok.Data;

@Data
public class ColumnDTO {
    private String name;
    private String dataType;
    private boolean nullable;
    private boolean primaryKey;
}
