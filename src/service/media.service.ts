import { AppDataSource } from "../../data-source";
import { Rating } from "../entity/Rating.entity";


export async function checkUserRating(userId: string, workId: string): Promise<boolean> {
    const ratingRepository = AppDataSource.getRepository(Rating);
  
    const rating = await ratingRepository.findOneBy({
      user_id: parseInt(userId, 10),
      work_id: parseInt(workId, 10),
    });
  
    return !!rating; // Convertit la valeur en booléen : true si rating existe, false sinon
  }

export async function getRatingByWorkIdAndUserId(userId: string, workId: string) {
    const ratingRepository = AppDataSource.getRepository(Rating);
    return await ratingRepository.findOne({
      where: {
        user_id: parseInt(userId, 10),
        work: { id: parseInt(workId, 10) },
      },
      relations: ["work"],
    });
  }
  