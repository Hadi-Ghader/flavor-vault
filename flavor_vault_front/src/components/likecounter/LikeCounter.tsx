type LikeCounterProps = {
  likesCount: number;
};

const LikeCounter: React.FC<LikeCounterProps> = ({ likesCount }) => {
  return <span>Likes: {likesCount}</span>;
};

export default LikeCounter;
