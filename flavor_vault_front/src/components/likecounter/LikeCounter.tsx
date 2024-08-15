type LikeCounterProps = {
  likesCount: number;
};

const LikeCounter: React.FC<LikeCounterProps> = ({ likesCount }) => {
  return (
    <span style={{ color: "var(--side-color)" }}>Likes: {likesCount}</span>
  );
};

export default LikeCounter;
