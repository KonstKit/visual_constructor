package com.dataflow.regex;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

@Service
public class RegexService {

    @Cacheable(value = "regexPatterns", key = "#pattern")
    protected Pattern compilePattern(String pattern) {
        return Pattern.compile(pattern);
    }

    public boolean validateRegex(String pattern) {
        try {
            compilePattern(pattern);
            return true;
        } catch (PatternSyntaxException ex) {
            return false;
        }
    }

    public List<Boolean> testRegex(String pattern, List<String> testCases) {
        Pattern p = compilePattern(pattern);
        List<Boolean> results = new ArrayList<>();
        for (String s : testCases) {
            results.add(p.matcher(s).find());
        }
        return results;
    }

    public List<String> getMatches(String pattern, String text) {
        Pattern p = compilePattern(pattern);
        Matcher m = p.matcher(text);
        List<String> matches = new ArrayList<>();
        while (m.find()) {
            matches.add(m.group());
        }
        return matches;
    }
}
