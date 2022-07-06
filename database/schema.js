export default {
    sql: `
        DROP TABLE IF EXISTS \`mints\`;
        DROP TABLE IF EXISTS \`token_trackers\`;
        DROP TABLE IF EXISTS \`collections\`;
        DROP TABLE IF EXISTS \`projects\`;

        CREATE TABLE \`projects\`
        (
            \`id\`   bigint       NOT NULL AUTO_INCREMENT,
            \`name\` varchar(255) NOT NULL,
            \`company_name\` varchar(255),
            \`contact_email\` varchar(255),
            PRIMARY KEY (\`id\`)
        );

        CREATE TABLE \`collections\`
        (
            \`id\`   bigint       NOT NULL AUTO_INCREMENT,
            \`project_id\` bigint NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`description\` TEXT,
            \`icon_url\` varchar(255),
            \`metadata_api_url\` varchar(255) NOT NULL,
            \`collection_image_url\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`),
            KEY \`collections_FK\` (\`project_id\`),
            CONSTRAINT \`collections_FK\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE \`token_trackers\`
        (
            \`id\`            bigint NOT NULL AUTO_INCREMENT,
            \`collection_id\`    bigint NOT NULL,
            \`last_token_id\` int DEFAULT NULL,
            PRIMARY KEY (\`id\`),
            KEY \`token_trackers_FK\` (\`collection_id\`),
            CONSTRAINT \`token_trackers_FK\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE = InnoDB
          AUTO_INCREMENT = 3
          DEFAULT CHARSET = utf8mb4
          COLLATE = utf8mb4_0900_ai_ci;

        
        CREATE TABLE \`mints\`
        (
            \`id\`             bigint       NOT NULL AUTO_INCREMENT,
            \`collection_id\`     bigint       NOT NULL,
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
            KEY \`mints_FK\` (\`collection_id\`),
            CONSTRAINT \`mints_FK\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        );
`
}