export interface OrmConfig {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    entities: string[];
    migrations: string[];
    subscribers: string[];
  }
  
  declare const config: OrmConfig;
  export = config;