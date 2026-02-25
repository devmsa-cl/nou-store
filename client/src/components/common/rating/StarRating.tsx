import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const starConfig = [
  { threshold: 5, stars: 5 },
  { threshold: 4.5, stars: 4.5 },
  { threshold: 4, stars: 4 },
  { threshold: 3.5, stars: 3.5 },
  { threshold: 3, stars: 3 },
  { threshold: 2.5, stars: 2.5 },
  { threshold: 2, stars: 2 },
  { threshold: 1.5, stars: 1.5 },
  { threshold: 1, stars: 1 },
  { threshold: 0.5, stars: 0.5 },
  { threshold: 0, stars: 0 },
];
const getStartComponent = (star: number, size: number = 22) => {
  const starComponents = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= star) {
      starComponents.push(<FaStar key={i} size={size} color="#FDCC0D" />);
    } else if (i - 0.5 === star) {
      starComponents.push(
        <FaStarHalfAlt key={i} size={size} color="#FDCC0D" />,
      );
    } else {
      starComponents.push(<FaRegStar key={i} size={size} color="#FDCC0D" />);
    }
  }
  return starComponents;
};
export const StarRating = ({ rate, size }: { rate: number; size?: number }) => {
  const starThreshold = starConfig.find((config) => rate >= config.threshold);
  return getStartComponent(starThreshold?.stars || 0, size);
};
