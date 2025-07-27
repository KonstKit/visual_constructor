package com.dataflow.database.util;

import java.sql.ResultSet;
import java.sql.SQLException;

public final class JdbcUtils {
    private JdbcUtils() {
    }

    public static String getString(ResultSet rs, String column) throws SQLException {
        String value = rs.getString(column);
        return value != null ? value : "";
    }

    public static void closeQuietly(AutoCloseable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (Exception ignored) {
            }
        }
    }
}
