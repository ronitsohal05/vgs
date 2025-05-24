package com.vgs.backend.util;

import java.text.Normalizer;

public class SlugUtil {
    public static String slugify(String input) {
        // 1) trim whitespace, replace spaces (and runs of spaces) with single hyphens
        String noWhitespace = input.trim().replaceAll("\\s+", "-");
        // 2) remove any non-word or non-hyphen characters (accents, punctuation, etc)
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD)
                                      .replaceAll("[^\\w\\-]", "");
        // 3) lowercase
        return normalized.toLowerCase();
    }
}
