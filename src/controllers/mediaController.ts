import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Component } from "../entity/Component.entity";
import { Rating } from "../entity/Rating.entity";
import { Work } from "../entity/Work.entity";
import {
  checkUserRating,
  getRatingByWorkIdAndUserId,
} from "../service/media.service";

const getMediaByType = async (req: Request, res: Response) => {
  const { type } = req.body;

  try {
    const workRepository = AppDataSource.getRepository(Work);

    const queryBuilder = workRepository
      .createQueryBuilder("work")
      .leftJoinAndSelect("work.mediaImage", "mediaImage");

    if (type) {
      console.log(type);
      queryBuilder.where("work.type = :type", { type });
    }

    const works = await queryBuilder.getMany();

    console.log(works);
    res.json(works);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const getAverageRating = async (req: Request, res: Response) => {
  const { targetId, targetType } = req.body;

  try {
    let queryBuilder = AppDataSource.getRepository(Rating).createQueryBuilder("rating");

    // Convertir targetId en nombre pour éviter les erreurs de type.
    const numericTargetId = parseInt(targetId, 10);

    // Appliquer le filtre en fonction du targetType.
    if (targetType === "work") {
      // Sélectionner uniquement les ratings directement liés au work (sans composants).
      queryBuilder = queryBuilder
        .where("rating.work_id = :targetId", { targetId: numericTargetId })
        .andWhere("rating.component_id IS NULL");
    } else {
      // La logique pour "component" reste inchangée.
      queryBuilder = queryBuilder
        .where("rating.component_id = :targetId", { targetId: numericTargetId });
    }

    // Exécuter la requête pour calculer la moyenne et le nombre de ratings.
    const result = await queryBuilder
      .select("AVG(rating.rating)", "average")
      .addSelect("COUNT(rating.id)", "count")
      .getRawOne();

    const averageRating = result.average ? parseFloat(result.average).toFixed(1) : "Not rated yet";
    const ratingsCount = parseInt(result.count, 10);

    // Envoyer le résultat.
    res.json({
      targetId: numericTargetId,
      targetType,
      averageRating,
      ratingsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const submitRating = async (req: Request, res: Response) => {
  const { targetId, targetType, rating, comment, userId } = req.body;

  // Valider les données reçues
  if ((targetType !== "work" && targetType !== "component") || !userId) {
    return res
      .status(400)
      .json({ message: "Invalid target type specified or missing user ID." });
  }

  if (typeof rating !== "number" || rating < 0 || rating > 10) {
    return res
      .status(400)
      .json({ message: "Rating must be a number between 0 and 10." });
  }

  try {
    const ratingRepository = AppDataSource.getRepository(Rating);

    let existingRating;

    if (targetType === "work") {
      existingRating = await ratingRepository.findOne({
        where: { work_id: targetId, user_id: userId },
      });
    } else if (targetType === "component") {
      existingRating = await ratingRepository.findOne({
        where: { component_id: targetId, user_id: userId },
      });
    }

    if (existingRating) {
      return res.status(403).json({
        message: "User has already submitted a rating for this target.",
      });
    }

    if (existingRating) {
      return res.status(403).json({
        message: "User has already submitted a rating for this target.",
      });
    }

    const newRating = new Rating();
    newRating.rating = rating;
    newRating.comment = comment;
    newRating.user_id = userId;

    if (targetType === "work") {
      const workRepository = AppDataSource.getRepository(Work);
      const work = await workRepository.findOneBy({ id: targetId });
      if (!work) {
        return res.status(404).json({ message: "Work not found." });
      }
      newRating.work_id = work.id; // Associez la note à l'ID du Work ciblé
    } else if (targetType === "component") {
      const componentRepository = AppDataSource.getRepository(Component);
      const component = await componentRepository.findOneBy({ id: targetId });
      if (!component) {
        return res.status(404).json({ message: "Component not found." });
      }
      newRating.component_id = component.id; // Associez la note à l'ID du Component ciblé
    }
    await ratingRepository.save(newRating);
    res.status(200).json({ message: "Rating submitted successfully." });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the rating." });
  }
};

const hasUserRated = async (req: Request, res: Response) => {
  const { userId, workId } = req.query;

  // Assurez-vous que userId et workId sont fournis
  if (!userId || !workId) {
    return res.status(400).json({ message: "Missing userId or workId" });
  }

  try {
    // Logique pour vérifier si une note existe
    const ratingExists = await checkUserRating(
      userId as string,
      workId as string
    );
    res.json({ hasRated: ratingExists });
  } catch (error) {
    console.error("Error checking user rating:", error);
    res
      .status(500)
      .json({ message: "Server error while checking user rating" });
  }
};

const getSpecificRating = async (req: Request, res: Response) => {
  const { userId, workId } = req.query;

  // Assurez-vous que les paramètres requis sont présents
  if (!userId || !workId) {
    return res
      .status(400)
      .json({ message: "Both userId and workId are required" });
  }

  try {
    const rating = await getRatingByWorkIdAndUserId(
      userId as string,
      workId as string
    );
    if (rating) {
      res.json(rating);
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: "Server error while fetching rating" });
  }
};

const modifyRating = async (req: Request, res: Response) => {
  const { userId, targetId, targetType, rating, comment } = req.body;

  // Valider les données reçues
  if (!userId || !targetId || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Trouver le rating existant
    const ratingRepository = AppDataSource.getRepository(Rating);
    const existingRating = await ratingRepository.findOne({
      where: {
        user_id: userId,
        [targetType === "work" ? "work_id" : "component_id"]: targetId,
      },
    });

    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Mettre à jour le rating et le commentaire
    existingRating.rating = rating;
    if (comment !== undefined) existingRating.comment = comment; // Mettre à jour le commentaire seulement s'il est fourni

    await ratingRepository.save(existingRating);

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Server error while updating rating" });
  }
};

const deleteRating = async (req: Request, res: Response) => {
  const { userId, workId } = req.body;

  try {
    // Supposer que chaque utilisateur ne peut laisser qu'un seul rating par œuvre
    const ratingRepository = AppDataSource.getRepository(Rating);
    const result = await ratingRepository.delete({
      user_id: parseInt(userId),
      work_id: parseInt(workId),
    });

    if (result.affected && result.affected > 0) {
      res.status(200).json({ message: "Rating deleted successfully" });
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fonction pour récupérer les ratings par workId
const computeComments = async (req: Request, res: Response) => {
  const workId = parseInt(req.query.workId as string);
  const page = parseInt(req.query.page as string) || 1;
  const ratingsPerPage = 10;

  try {
    // Compter le nombre total de ratings
    const totalRatings = await AppDataSource
    .getRepository(Rating)
    .createQueryBuilder("rating")
    .where("rating.work_id = :workId", { workId })
    .andWhere("rating.component_id IS NULL")
    .getCount();


    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalRatings / ratingsPerPage);

    const ratings = await AppDataSource.getRepository(Rating)
      .createQueryBuilder("rating")
      .leftJoinAndSelect("rating.user", "user") // Assurez-vous que la relation dans Rating est définie pour pointer vers User
      .where("rating.work_id = :workId", { workId })
      .andWhere("rating.component_id IS NULL")
      .take(ratingsPerPage)
      .skip((page - 1) * ratingsPerPage)
      .orderBy("rating.date", "DESC")
      .getMany();

    // Préparer les données pour la réponse
    const response = {
      comments: ratings.map((rating) => ({
        id: rating.id,
        comment: rating.comment,
        rating: rating.rating,
        date: rating.date.toISOString().split("T")[0], // Format de date "YYYY-MM-DD"
        userName: rating.user.username, // Ou tout autre champ représentant le nom de l'utilisateur
      })),
      totalPages,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching ratings by workId:", error);
    res.status(500).json({ message: "Error fetching ratings" });
  }
};

const getSeasonsByWorkId = async (req: Request, res: Response) => {
  const { workId } = req.query;

  try {
    const seasons = await AppDataSource.getRepository(Component)
      .createQueryBuilder("component")
      .where("component.work_id = :workId", { workId }) // Correction ici
      .andWhere("component.type = :type", { type: "saison" })
      .getMany();

    res.json(seasons);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    res.status(500).json({ message: "Error fetching seasons" });
  }
};

const getRatingsBySeason = async (req: Request, res: Response) => {
  const { seasonId } = req.query;
  try {
    // Utilisation de queryBuilder pour grouper par numéro d'épisode et calculer la moyenne des notes
    const episodeRatings = await AppDataSource.getRepository(Rating)
      .createQueryBuilder("rating")
      .select("component.number", "episodeNumber")
      .addSelect("AVG(rating.rating)", "averageRating")
      .leftJoin("rating.component", "component")
      .where("component.parent_id = :seasonId", { seasonId })
      .andWhere("component.type = :type", { type: "episode" })
      .groupBy("component.number")
      .orderBy("component.number", "ASC")
      .getRawMany();

    // Transformer les résultats pour s'assurer que la moyenne des notes est un nombre flottant
    const transformedRatings = episodeRatings.map(rating => ({
      episodeNumber: rating.episodeNumber,
      averageRating: parseFloat(rating.averageRating).toFixed(1),
    }));

    res.json(transformedRatings);
  } catch (error) {
    console.error("Error fetching episode ratings:", error);
    res.status(500).json({ message: "Error fetching episode ratings" });
  }
};



export {
  getAverageRating,
  getMediaByType,
  hasUserRated,
  submitRating,
  getSpecificRating,
  modifyRating,
  deleteRating,
  computeComments,
  getSeasonsByWorkId,
  getRatingsBySeason,
};
