import { Work } from "./Work";

// Définition du type Component pour le frontend
export type Component = {
    id: number;
    work_id: number; // ID du Work associé
    parent_id?: number; // ID du parent Component, si applicable
    type: 'saison' | 'episode' | 'arc' | 'chapitre'; // Enumération des types possibles
    title: string;
    number?: number; // Numéro de l'épisode/saison/arc/chapitre
    releaseDate?: string; // Date de sortie, formatée comme une chaîne de caractères
    work?: Work; // Optionnel, si vous souhaitez inclure les détails du Work associé
  }