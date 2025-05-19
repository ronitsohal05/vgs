package com.vgs.backend.model;

import java.util.List;

public class UniversityEntry {
    private String name;
    private List<String> domains;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getDomains() {
        return domains;
    }

    public void setDomains(List<String> domains) {
        this.domains = domains;
    }
}
