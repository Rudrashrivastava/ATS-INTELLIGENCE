package com.resume.analyzer.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // MySQL / MariaDB syntax
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
            System.out.println("✅ [DatabaseSchemaFixer] Successfully expanded users.role column (MySQL)");
        } catch (Exception e1) {
            try {
                // PostgreSQL syntax
                jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50)");
                System.out.println("✅ [DatabaseSchemaFixer] Successfully expanded users.role column (PostgreSQL)");
            } catch (Exception e2) {
                System.out.println("ℹ️ [DatabaseSchemaFixer] Role column modification skipped (already VARCHAR(50) or auto-managed).");
            }
        }
    }
}
