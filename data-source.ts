import { DataSource, DataSourceOptions } from 'typeorm';
import config from './ormconfig';
import { User } from './src/entity/User.entity';

const typedConfig: DataSourceOptions = {
    ...config,
    type: "mysql", // Remplacez par le type spécifique de votre base de données
    entities: [User]
    // autres options...
}

export const AppDataSource = new DataSource(typedConfig);
