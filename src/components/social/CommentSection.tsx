"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface CommentSectionProps {
  predictionId?: string;
  couponPredictionId?: string;
  comments: Comment[];
  onSubmit?: (text: string) => void | Promise<void>;
}

export default function CommentSection({
  predictionId,
  couponPredictionId,
  comments,
  onSubmit,
}: CommentSectionProps) {
  const t = useTranslations("social");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(trimmed);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatCommentTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return t("minutesAgo", { count: diffMin });
    if (diffHours < 24) return t("hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("daysAgo", { count: diffDays });
    return formatTime(date);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Comments header */}
      <h4 className="text-sm font-medium text-dark-300">
        {t("comments")} ({comments.length})
      </h4>

      {/* Comments list */}
      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-sm text-dark-500 text-center py-4">
            {t("noComments")}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              {/* Avatar */}
              {comment.user.avatar ? (
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-dark-700 shrink-0"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-700 text-dark-300 text-xs font-semibold shrink-0">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark-100 truncate">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-dark-500 shrink-0">
                    {formatCommentTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-dark-300 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 pt-2 border-t border-dark-700">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("addComment")}
          disabled={isSubmitting}
          className={cn(
            "flex-1 rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-dark-100",
            "placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40",
            "disabled:opacity-50"
          )}
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700",
            "disabled:opacity-40 disabled:pointer-events-none"
          )}
          aria-label={t("postComment")}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
