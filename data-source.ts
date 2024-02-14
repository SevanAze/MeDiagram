import { DataSource, DataSourceOptions } from 'typeorm';
import config from './ormconfig';

const typedConfig: DataSourceOptions = {
    ...config,
    type: "mysql", // Remplacez par le type spécifique de votre base de données
    // autres options...
}

export const AppDataSource = new DataSource(config as DataSourceOptions);
