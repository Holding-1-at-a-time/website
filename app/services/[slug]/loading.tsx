export default function ServiceLoading() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading service...</p>
        </div>
      </div>
    </div>
  );
}