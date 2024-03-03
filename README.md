# MeDiagram
🇬🇧 : A project that seeks to help binge-watchers and binge-readers.

🇫🇷 : Projet ayant pour objectif de permettre aux consommateurs de divers médias de mieux appréhender la qualité d'un contenu.

# Description
L'objectif sera de réaliser une interface de visualisations des notations pour différents types de média (Séries TV, Saga de Livres, Mangas...). Un tel affichage permettrait de visualiser en un clin d’œil la notation de l'ensemble des épisodes ou chapitres, permettant ainsi à l'utilisateur de savoir si une série mérite d'être regardée ou non.

Le projet en tant que tel se veut démonstratif : pour pouvoir être utilisé réellement dans la vie quotidienne il faudrait préalablement bâtir une communauté d'utilisateurs, ce qui permettrait de construire une base de donnée de notes pour les différents médias. Dans un soucis de simplicité, et pour éviter d'afficher des séries ou livres n'ayant reçu aucune note pour le moment, nous disposons actuellement d'une base de données de seulement 4 films & séries. L'ajout d'un nouveau contenu peut se faire aisément depuis la base de donnée MariaDB. 

# Membres de l'équipe et rôles
- Sévan Azé : Développeur Full Stack / Gestion & hébergement du projet
- Jules Daubin : Designer / Développement Frontend
- Nino Chavigny : Développeur Full Stack

Pour build le projet :

>`npm ci`
>`npm run build:dev`

Pour start le projet :

>`npm run start:dev`

# Technologies utilisées
- React.js
- Node.js
- Express.js
- Webpack 
- MariaDB
- TypeScript
- Material-UI
- Swiper.js
- PM2
- JWT (JSON Web Tokens)
- Oracle Cloud

# Démo
Le site est hébergé en guise de démonstration à l'adresse suivante : [media-gram.me](https://media-gram.me/) L'ensemble des fonctionnalités sont disponibles depuis le site Web. Le cœur du projet étant la visualisation des notes **épisode par épisode**, sous la forme d'un **graphique**, nous conseillons de se rendre sur la page de notation de la série Peaky Blinders, qui dispose de notes pour les 2 premières saisons.

# Bugs connus

La plupart des bugs identifiés ont été corrigés. Il en reste certainement, mais l'utilisation générale du site Web se fait sans accrocs. Des défauts liés à l'UX - qui ne sont pas des bugs - sont néanmoins présents : certaines tuiles ne sont pas cliquables (notamment sur la page d'accueil), ou encore la liste des différents contenus ne s'affiche que lorsque la barre de recherche est sélectionnée.

Note : Il est possible de se connecter sans entrer de nom d'utilisateur ou de mot de passe. Ce "problème" est facilement résoluble, mais nous avons choisit de le laisser tel quel car cela permet de tester aisément notre site Web (et notamment l'ajout de nouvelles fonctionnalités de notation). Ainsi, cela correspond en quelque sorte à un utilisateur "anonyme", qui pourrait lui aussi mettre des notes (aux modérateurs du site Web de choisir ensuite si les avis laissés par les utilisateurs anonymes doivent être acceptés ou non).

# Améliorations possibles 

- Faire en sorte que les tuiles à l'accueil soient cliquables
- Disposer d'un nombre plus important de contenu, notamment dans la catégorie "Saga de livres" et "Manga".
