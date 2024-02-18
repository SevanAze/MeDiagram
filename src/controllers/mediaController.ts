import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { Work } from "../entity/Work.entity";
import { Rating } from "../entity/Rating.entity";

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

export { getMediaByType, getAverageRating };
