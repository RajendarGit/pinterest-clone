const Loading = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading your boards...</span>
      </div>
    </div>
  );
};

export default Loading;
