// src/database/hana.datasource.ts
import { DataSource } from 'typeorm';

export const hanaDataSource = new DataSource({
  type: 'sap', // Use 'sap' for SAP HANA
  host: 'd76aa042-8df4-48ff-8373-c4d8f74588d4.hana.trial-us10.hanacloud.ondemand.com', // SQL Endpoint
  port: 443, // Port for HANA Cloud
  username: 'DBADMIN', // Administrator username
  password: 'invent2K25', // Administrator password
  database: 'd76aa042-8df4-48ff-8373-c4d8f74588d4', // Instance ID or database name
  schema: 'DBADMIN', // Explicitly set the schema
  synchronize: true, // Auto-create tables (disable in production)
  logging: true, // Enable logging for debugging
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Load entities
  extra: {
    encrypt: true, // Enable encryption
    trustServerCertificate: true, // Trust the server certificate
    connectionTimeout: 30000, // Increase connection timeout (in milliseconds)
  },
});