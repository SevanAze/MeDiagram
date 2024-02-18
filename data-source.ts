import { DataSource, DataSourceOptions } from 'typeorm';
import config from './ormconfig';
import { User } from './src/entity/User.entity';
import { Work } from './src/entity/Work.entity';
import { MediaImage } from './src/entity/MediaImage.entity';
import { Rating } from './src/entity/Rating.entity';
import { Component } from './src/entity/Component.entity';

const typedConfig: DataSourceOptions = {
    ...config,
    type: "mysql", // Remplacez par le type spécifique de votre base de données
    entities: [User, Work, MediaImage, Rating, Component]
    // autres options...
}

export const AppDataSource = new DataSource(typedConfig);
