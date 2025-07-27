package com.dataflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching

public class DataFlowBuilderApplication {

    public static void main(String[] args) {
        SpringApplication.run(DataFlowBuilderApplication.class, args);
    }
}
