'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Send, Trash2, Clock, Sparkles } from 'lucide-react';

interface NoteItem {
  id: string;
  timestamp_seconds: number;
  content: string;
  created_at: string;
}

export default function NotesComponent({
  lessonId,
  currentVideoTime = 0,
  onSeekTo,
}: {
  lessonId: string;
  currentVideoTime?: number;
  onSeekTo?: (seconds: number) => void;
}) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/notes?lessonId=${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          timestampSeconds: Math.floor(currentVideoTime),
          content: newContent.trim(),
        }),
      });

      if (res.ok) {
        setNewContent('');
        await fetchNotes();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes?id=${noteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== noteId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-slate-900 text-sm">Ghi Chú Học Tập Cá Nhân</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">{notes.length} ghi chú</span>
      </div>

      {/* Input box */}
      <form onSubmit={handleAddNote} className="mb-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Gắn mốc: {formatSeconds(currentVideoTime)}
          </span>
          <span className="text-[10px] text-slate-400">Ghi lại suy nghĩ hoặc câu hỏi</span>
        </div>
        <div className="flex gap-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Nhập nội dung ghi chú tại thời điểm này..."
            rows={2}
            className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newContent.trim()}
            className="px-4 bg-slate-900 hover:bg-blue-900 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[360px] pr-1">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-4">Đang tải ghi chú...</p>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            Chưa có ghi chú nào. Hãy ghi lại những điểm đắt giá khi xem bài giảng!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-xs flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => onSeekTo && onSeekTo(note.timestamp_seconds)}
                  className="font-mono text-[10px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 hover:bg-blue-50 transition-colors inline-flex items-center gap-1 mb-1.5"
                  title="Nhảy đến thời điểm này trong video"
                >
                  <Clock className="w-3 h-3" />
                  {formatSeconds(note.timestamp_seconds)}
                </button>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                title="Xóa ghi chú"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
