import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { Work } from "../entity/Work.entity";
import { Rating } from "../entity/Rating.entity";
import { Component } from "../entity/Component.entity";

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
      const queryBuilder = AppDataSource.getRepository(Rating).createQueryBuilder('rating');
  
      // Convertir targetId en nombre
      const numericTargetId = parseInt(targetId, 10);
  
      if (targetType === 'work') {
        queryBuilder.where('rating.work_id = :targetId', { targetId: numericTargetId });
      } else if (targetType === 'component') {
        queryBuilder.where('rating.component_id = :targetId', { targetId: numericTargetId });
      } else {
        return res.status(400).json({ message: 'Invalid target type' });
      }
  
      // Calculer la moyenne
      const averageRatingResult = await queryBuilder.select('AVG(rating.rating)', 'average')
                                                     .getRawOne();
  
      const averageRating = averageRatingResult.average ? parseFloat(averageRatingResult.average) : 'Not rated yet';
  
      res.json({ targetId: numericTargetId, targetType, averageRating });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Fonction pour soumettre un rating
export async function submitRating(req: Request, res: Response) {
  const { targetId, targetType, rating, comment } = req.body;

  // Valider les données reçues
  if (targetType !== "work" && targetType !== "component") {
      return res.status(400).json({ message: "Invalid target type specified." });
  }
  if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return res.status(400).json({ message: "Rating must be a number between 0 and 10." });
  }

  try {
      const ratingRepository = AppDataSource.getRepository(Rating);
      const newRating = new Rating();
      newRating.rating = rating;
      newRating.comment = comment;

      if (targetType === "work") {
          const work = await AppDataSource.getRepository(Work).findOneBy({ id: targetId });
          if (!work) {
              return res.status(404).json({ message: "Work not found." });
          }
          newRating.work = work;
      } else if (targetType === "component") {
          const component = await AppDataSource.getRepository(Component).findOneBy({ id: targetId });
          if (!component) {
              return res.status(404).json({ message: "Component not found." });
          }
          newRating.component = component;
      }

      await ratingRepository.save(newRating);
      res.status(200).json({ message: "Rating submitted successfully." });
  } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ message: "An error occurred while submitting the rating." });
  }
}

export { getMediaByType, getAverageRating };
