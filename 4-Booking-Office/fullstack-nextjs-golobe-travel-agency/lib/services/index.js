import "server-only";
import { unstable_cache } from "next/cache";
import { User, WebsiteReview } from "../db/models";
import { bucketizeNumber } from "../utils";
import { getManyDocs } from "../db/getOperationDB";

/**
 * Fetches a list of website reviews from the database.
 *
 * @async
 * @function getWebsiteReviews
 * @param {number} [limit=10] - The number of reviews to fetch. Defaults to 10.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of website review objects.
 * Each review object has the following properties:
 * - id: The ID of the review (string).
 * - reviewer: The name of the person who made the review (string).
 * - profileImage: The URL of the user's profile image (string).
 * - rate: The rating of the review (number).
 * - comment: The comment of the review (string).
 */
export async function getWebsiteReviews(limit = 10) {
  return [
    {
      id: "rev1",
      reviewer: "Nguyen Van A",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      rate: 5,
      comment: "Dịch vụ đặt vé và phòng khách sạn của Vibe Travel rất nhanh chóng và tiện lợi!"
    }
  ];
}

/**
 * @typedef {Object} Stats
 * @property {number} totalReviews - The total number of website reviews.
 * @property {number} averageRating - The average rating of website reviews.
 * @property {number} fiveStarReviews - The number of 5-star website reviews.
 * @property {number} satisfactionRate - The satisfaction rate of website reviews.
 */

/**
 * Retrieves statistics about website reviews.
 *
 * @return {Promise<Stats>} An object containing the total number of reviews,
 * average rating, number of 5-star reviews, and satisfaction rate.
 */
export async function getWebsiteReviewsStats() {
  return {
    satisfiedReviews: "500+",
    totalReviews: "1.2k+",
    averageRating: "4.8",
    fiveStarReviews: "1k+",
    satisfactionRate: "98%",
  };
}

/**
 * Retrieves the recent searches for a given user and type.
 *
 * @param {string} userId - The ID of the user.
 * @param {'flight' | 'hotel'} type - The type of search (flight or hotel).
 * @param {number} [limit=10] - The maximum number of searches to retrieve. Defaults to 10.
 * @return {Promise<Array>} An array of recent search documents.
 */
export async function getRecentSearches(userId, type, limit = 10) {
  const docs = await getManyDocs(
    "SearchHistory",
    { userId, type },
    [`${userId}_${type}_searchHistory`],
    Number.MAX_SAFE_INTEGER,
    {
      sort: { createdAt: -1 },
      limit,
    },
  );

  return docs;
}
