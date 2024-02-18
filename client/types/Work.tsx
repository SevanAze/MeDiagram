// Importation de MediaImage dans le fichier Work.ts
import { MediaImage } from './MediaImage';

// types.ts
export enum WorkType {
    TVShow = "serie_tv",
    Manga = "manga",
    BookSaga = "book_saga",
  }
  
  export type Work = {
    id: string; // ou number
    title: string;
    type?: string; // Vous pourriez également vouloir utiliser un enum pour les types
    description?: string;
    releaseYear: number;
    genre: string;
    mediaImage?: MediaImage; // Tableau d'images média associées
    // Ajoutez d'autres champs ici selon les besoins
  };