export default {
    sql: `
        DROP TABLE IF EXISTS \`token_trackers\`;
        DROP TABLE IF EXISTS \`mints\`;
        DROP TABLE IF EXISTS \`projects\`;

        CREATE TABLE \`projects\`
        (
            \`id\`   bigint       NOT NULL AUTO_INCREMENT,
            \`name\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)
        );

        CREATE TABLE \`token_trackers\`
        (
            \`id\`            bigint NOT NULL AUTO_INCREMENT,
            \`project_id\`    bigint NOT NULL,
            \`last_token_id\` int DEFAULT NULL,
            PRIMARY KEY (\`id\`),
            KEY \`token_trackers_FK\` (\`project_id\`),
            CONSTRAINT \`token_trackers_FK\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE = InnoDB
          AUTO_INCREMENT = 3
          DEFAULT CHARSET = utf8mb4
          COLLATE = utf8mb4_0900_ai_ci;

        
        CREATE TABLE \`mints\`
        (
            \`id\`             bigint       NOT NULL AUTO_INCREMENT,
            \`project_id\`     bigint       NOT NULL,
            \`tx_hash\`        varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
            \`wallet\`         varchar(255) NOT NULL,
            \`tokens_allowed\` int                                                           DEFAULT NULL,
            \`tokens_minted\`  int                                                           DEFAULT '0',
            \`block_number\`   bigint                                                        DEFAULT NULL,
            \`tx_ether_value\` decimal(30, 20)                                               DEFAULT NULL,
            \`created_at\`     timestamp    NULL                                             DEFAULT CURRENT_TIMESTAMP,
            \`metadata\`       json                                                          DEFAULT NULL,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`mints_UN\` (\`tx_hash\`, \`wallet\`),
            KEY \`mints_FK\` (\`project_id\`),
            CONSTRAINT \`mints_FK\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        );
`
}