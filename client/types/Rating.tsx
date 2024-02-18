import { Component } from "./Component";
import { Work } from "./Work";

// Type Rating pour le frontend
export type Rating = {
    id: number;
    rating: number;
    work_id?: number;
    component_id?: number;
    comment?: string;
    work?: Work; // Optionnel, dépend de si votre backend envoie cette info
    episode?: Component; // Optionnel, utilisez le nom correct selon votre modèle
  }