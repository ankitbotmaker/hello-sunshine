import { useState, useEffect } from "react";
import { User, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  user_id: string;
  course_slug: string;
  rating: number;
  comment: string | null;
  user_name: string | null;
  created_at: string;
}

interface CourseReviewsProps {
  courseSlug: string;
}

const CourseReviews = ({ courseSlug }: CourseReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [courseSlug]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const existing = reviews.find((r) => r.user_id === user.id);
      if (existing) {
        setUserReview(existing);
        setRating(existing.rating);
        setComment(existing.comment || "");
      }
    }
  }, [user, reviews]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("course_slug", courseSlug)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length > 1000) {
      toast({
        title: "Comment Too Long",
        description: "Please keep your comment under 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            comment: comment.trim() || null,
          })
          .eq("id", userReview.id);

        if (error) throw error;
        toast({
          title: "Review Updated",
          description: "Your review has been updated.",
        });
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert({
          user_id: user.id,
          course_slug: courseSlug,
          rating,
          comment: comment.trim() || null,
          user_name: user.email?.split("@")[0] || "Anonymous",
        });

        if (error) throw error;
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        });
      }

      setIsEditing(false);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", userReview.id);

      if (error) throw error;
      
      setUserReview(null);
      setRating(5);
      setComment("");
      toast({
        title: "Review Deleted",
        description: "Your review has been removed.",
      });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Course Reviews
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-foreground mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-muted-foreground mt-2">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-2">
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Write Review Form */}
            {user && (!userReview || isEditing) && (
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-xl p-6 space-y-4"
              >
                <h3 className="font-semibold text-foreground">
                  {userReview ? "Edit Your Review" : "Write a Review"}
                </h3>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your Rating
                  </label>
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onRatingChange={setRating}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your Review (optional)
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this course..."
                    rows={4}
                    maxLength={1000}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {comment.length}/1000 characters
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : userReview
                      ? "Update Review"
                      : "Submit Review"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        if (userReview) {
                          setRating(userReview.rating);
                          setComment(userReview.comment || "");
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* User's existing review */}
            {user && userReview && !isEditing && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Your Review</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(userReview.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleDelete}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <StarRating rating={userReview.rating} size="sm" />
                {userReview.comment && (
                  <p className="text-foreground mt-3">{userReview.comment}</p>
                )}
              </div>
            )}

            {!user && (
              <div className="bg-secondary/50 border border-border rounded-xl p-6 text-center">
                <p className="text-muted-foreground">
                  Please{" "}
                  <a href="/auth" className="text-primary hover:underline">
                    login
                  </a>{" "}
                  to leave a review.
                </p>
              </div>
            )}

            {/* Other Reviews */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-full bg-muted rounded mt-4" />
                    <div className="h-4 w-2/3 bg-muted rounded mt-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews
                  .filter((r) => r.user_id !== user?.id)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="bg-card border border-border rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {review.user_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      {review.comment && (
                        <p className="text-foreground mt-3">{review.comment}</p>
                      )}
                    </div>
                  ))}

                {reviews.filter((r) => r.user_id !== user?.id).length === 0 &&
                  !userReview && (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review this course!
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseReviews;
