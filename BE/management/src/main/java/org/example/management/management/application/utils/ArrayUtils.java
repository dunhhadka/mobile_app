package org.example.management.management.application.utils;

import java.util.List;
import java.util.stream.Stream;

public final class ArrayUtils {
    public static  <T> Stream<T> convert(List<T> list) {
        return list == null ? Stream.of() : list.stream();
    }
}
