const Loading = () => {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span>Loading more pins...</span>
    </div>
  );
};

export default Loading;
