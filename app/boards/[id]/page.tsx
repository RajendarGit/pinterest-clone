"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, MoreHorizontal, Lock, Users } from "lucide-react";
import Link from "next/link";
import { MasonryGrid } from "@/components/masonry-grid";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks/redux";
import type { Board } from "@/lib/store/slices/boardsSlice";
import type { Pin } from "@/lib/store/slices/pinsSlice";
import { withAuth } from "@/components/hoc";

function BoardDetailPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { boards } = useAppSelector((state) => state.boards);
  const [board, setBoard] = useState<Board | null>(null);
  const [boardPins, setBoardPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the board
    const foundBoard = boards.find((b) => b.id === boardId);
    setBoard(foundBoard || null);

    // Load pins for this board - using mock data for now
    const mockPins: Pin[] = Array.from({ length: 12 }, (_, i) => {
      const width = 300 + Math.floor(Math.random() * 200);
      const height = 200 + Math.floor(Math.random() * 400);
      const id = `board-${boardId}-pin-${i}`;

      return {
        id,
        title: `Pin ${i + 1} from ${foundBoard?.title || "Board"}`,
        description: `A beautiful pin saved to this board`,
        image_url: `/placeholder.svg?height=${height}&width=${width}&query=beautiful+${foundBoard?.title
          ?.toLowerCase()
          .replace(/\s+/g, "+")}`,
        alt_text: `Pin ${i + 1}`,
        width,
        height,
        user_id: "demo-user",
        board_id: boardId,
        created_at: new Date().toISOString(),
        user: {
          username: "photographer",
          display_name: "Amazing Photographer",
          avatar_url: "/diverse-profile-avatars.png",
        },
      };
    });

    setBoardPins(mockPins);
    setLoading(false);
  }, [boardId, boards]);

  const handleLoadMore = () => {
    // Mock load more functionality
    console.log("Load more pins for board:", boardId);
  };

  if (!board && !loading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Board not found
        </h1>
        <p className="text-muted-foreground mb-6">
          The board you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/boards">Back to boards</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/boards">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to boards
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading board...</span>
          </div>
        </div>
      ) : board ? (
        <>
          {/* Board header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold text-foreground">
                {board.title}
              </h1>
              {board.is_private && (
                <Lock className="w-6 h-6 text-muted-foreground ml-3" />
              )}
            </div>

            {board.description && (
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
                {board.description}
              </p>
            )}

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-6">
              <span>{boardPins.length} pins</span>
              <span>
                Created {new Date(board.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add pins
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Collaborate
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Board pins */}
          {boardPins.length > 0 ? (
            <MasonryGrid
              pins={boardPins}
              onLoadMore={handleLoadMore}
              hasMore={false}
              loading={false}
            />
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No pins yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start adding pins to this board
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add your first pin
              </Button>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default withAuth(BoardDetailPage);