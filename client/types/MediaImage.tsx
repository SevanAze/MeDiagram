export type MediaImage = {
    id: string; // ou number, selon votre structure de base de données
    work_id: number;
    image_type: string;
    image_path: string,
    // Ajoutez d'autres champs ici selon les besoins, par exemple :
    // caption: string;
  };