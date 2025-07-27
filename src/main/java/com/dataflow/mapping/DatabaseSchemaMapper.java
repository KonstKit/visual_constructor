package com.dataflow.mapping;

import com.dataflow.database.metadata.ColumnInfo;
import com.dataflow.database.metadata.DatabaseSchema;
import com.dataflow.database.metadata.TableInfo;
import com.dataflow.dto.ColumnDTO;
import com.dataflow.dto.SchemaDTO;
import com.dataflow.dto.TableDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DatabaseSchemaMapper {
    SchemaDTO toDto(DatabaseSchema schema);
    TableDTO toDto(TableInfo table);
    ColumnDTO toDto(ColumnInfo column);
}
