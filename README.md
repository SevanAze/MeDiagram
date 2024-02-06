# MeDiagram
A project that seeks to help binge-watchers and binge-readers.

# TODO
L'objectif sera de réaliser une interface de visualisations des notations pour différents types de média (Séries TV, Saga de Livres, Mangas...). Un tel affichage permettrait de visualiser en un clin d’œil la notation de l'ensemble des épisodes ou chapitres, permettant ainsi à l'utilisateur de savoir si une série mérite d'être regardée ou non.

# Plan d'exécution

### Étape 1: Initialisation du Projet

1. **Mise en place du projet Git**
   - Créer un nouveau dépôt Git pour votre projet.
   - Initialiser le projet avec un fichier `.gitignore` adapté à Node.js et React.

2. **Mise en place du Front-end**
   - Initialiser un projet React avec TypeScript.
   - Intégrer Bootstrap et MUI pour la conception de l'interface utilisateur.

3. **Mise en place du Back-end**
   - Initialiser un projet Node.js avec Express.
   - Configurer le serveur pour recevoir des requêtes HTTP.

Pour build le projet :

>`npm ci`
>`npm run build:dev`

Pour start le projet :

>`npm run start:dev`

### Étape 2: Conception de la Base de Données

4. **Modélisation de la Base de Données**
   - Définir la structure de la base de données en utilisant les tables mentionnées.

5. **Création de la Base de Données**
   - Créer la base de données MySQL.
   - Créer les tables "Series_TV", "Mangas", "Book_Sagas", "Episodes", et "Episode_Ratings".

### Étape 3: API Back-end

6. **Création des Routes API**
   - Mettre en place les routes nécessaires pour récupérer les données des épisodes et attribuer des notes.

7. **Logique du Back-end**
   - Implémenter la logique pour obtenir la note moyenne d'un épisode.
   - Permettre l'ajout de nouvelles notes d'épisodes.

### Étape 4: Front-end - Affichage des Notes des Séries TV

8. **Création des Composants React**
   - Créer des composants React pour afficher la liste des séries TV et les détails des épisodes.

9. **Intégration avec l'API Back-end**
   - Connecter le Front-end au Back-end en utilisant des requêtes HTTP pour récupérer les données d'épisodes.

10. **Affichage des Notes**
    - Utiliser des graphiques (courbes ou nuages de points) pour afficher les notes des épisodes.

### Étape 5: Déploiement sur Azure

11. **Configuration du Serveur Azure**
    - Créer une instance de serveur sur Azure.
    - Configurer l'environnement pour Node.js.

12. **Déploiement de l'Application**
    - Déployer le Front-end et le Back-end sur le serveur Azure.

### Étape 6: Finalisation

13. **Optimisation et Amélioration**
    - Optimiser le code.
    - Ajouter des fonctionnalités supplémentaires si nécessaire.

14. **Documentation**
    - Ajouter des commentaires détaillés dans le code.
    - Créer une documentation pour le projet.

15. **Tests (Optionnel)**
    - Ajouter des tests unitaires ou d'intégration si nécessaire (même si vous ne le souhaitez pas pour le moment).
