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
    // Initialisation du query builder
    const queryBuilder =
      AppDataSource.getRepository(Rating).createQueryBuilder("rating");

    // Convertir targetId en nombre
    const numericTargetId = parseInt(targetId, 10);

    if (targetType === "work") {
      queryBuilder.where("rating.work_id = :targetId", {
        targetId: numericTargetId,
      });
    } else if (targetType === "component") {
      queryBuilder.where("rating.component_id = :targetId", {
        targetId: numericTargetId,
      });
    } else {
      return res.status(400).json({ message: "Invalid target type" });
    }

    // Calculer la moyenne et compter le nombre de ratings
    const result = await queryBuilder
      .select("AVG(rating.rating)", "average")
      .addSelect("COUNT(rating.id)", "count")
      .getRawOne();

    const averageRating = result.average
      ? parseFloat(result.average)
      : "Not rated yet";
    const ratingsCount = result.count ? parseInt(result.count, 10) : 0;

    res.json({ targetId: numericTargetId, targetType, averageRating, ratingsCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
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

    // Vérifier si une note existe déjà pour cet utilisateur et ce targetId
    const existingRating = await ratingRepository.findOne({
      where: [
        { work_id: targetType === "work" ? targetId : null, user_id: userId },
        {
          component_id: targetType === "component" ? targetId : null,
          user_id: userId,
        },
      ],
    });

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

export {
  getAverageRating,
  getMediaByType,
  hasUserRated,
  submitRating,
  getSpecificRating,
  modifyRating,
};
