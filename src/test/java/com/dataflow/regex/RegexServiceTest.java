package com.dataflow.regex;

import com.dataflow.regex.RegexService;
import com.dataflow.regex.RegexTemplateLibrary;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class RegexServiceTest {

    @Configuration
    static class TestConfig {
        @Bean
        CountingRegexService regexService() {
            return new CountingRegexService();
        }
        @Bean
        RegexTemplateLibrary templateLibrary() {
            return new RegexTemplateLibrary();
        }
    }

    static class CountingRegexService extends RegexService {
        AtomicInteger count = new AtomicInteger();
        @Override
        @org.springframework.cache.annotation.Cacheable(value = "regexPatterns", key = "#pattern")
        protected Pattern compilePattern(String pattern) {
            count.incrementAndGet();
            return Pattern.compile(pattern);
        }
    }

    @Autowired
    CountingRegexService service;

    @Test
    void validateWorks() {
        assertThat(service.validateRegex("a+")).isTrue();
        assertThat(service.validateRegex("[")).isFalse();
    }

    @Test
    void testRegexWorks() {
        List<Boolean> res = service.testRegex("a+", List.of("a", "b"));
        assertThat(res).containsExactly(true, false);
    }

    @Test
    void getMatchesWorks() {
        List<String> matches = service.getMatches("a+", "baaab");
        assertThat(matches).containsExactly("aaa", "a");
    }

    @Test
    void cachingWorks() {
        service.validateRegex("a+");
        service.validateRegex("a+");
        assertThat(service.count.get()).isEqualTo(1);
    }
}
