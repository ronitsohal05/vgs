package com.vgs.backend.util;

import com.vgs.backend.model.UniversityEntry;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.List;

@Component
public class UniversityDomainMap {

    private final Map<String, Set<String>> universityDomainMap = new HashMap<>();
    
    public Map<String, Set<String>> getUniversityDomainMap() {
        return universityDomainMap;
    }

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/us_universities.json");
            List<UniversityEntry> universities = mapper.readValue(is, new TypeReference<List<UniversityEntry>>() {});

            for (UniversityEntry uni : universities) {
                universityDomainMap.put(uni.getName(), new HashSet<>(uni.getDomains()));
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load university domains");
        }
    }
}
