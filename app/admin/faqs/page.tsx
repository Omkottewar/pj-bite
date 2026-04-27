"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { showToast, showConfirm, showError } from "@/lib/swal";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

const EMPTY_FORM = { question: "", answer: "", order: 0, active: true };

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (res.ok) setFaqs(data.data || []);
    } catch {
      showError("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleCreate = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("Question and answer are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("FAQ created", "success");
      setIsCreating(false);
      setForm(EMPTY_FORM);
      fetchFaqs();
    } catch (err: any) {
      showError("Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/faqs/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("FAQ updated", "success");
      setEditing(null);
      fetchFaqs();
    } catch (err: any) {
      showError("Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await showConfirm("Delete FAQ?", "This cannot be undone.");
    if (!ok) return;
    try {
      await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      showToast("FAQ deleted", "success");
      fetchFaqs();
    } catch {
      showError("Failed to delete FAQ");
    }
  };

  const handleToggle = async (faq: FAQ) => {
    try {
      await fetch(`/api/faqs/${faq._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !faq.active }),
      });
      fetchFaqs();
    } catch {
      showError("Failed to update");
    }
  };

  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    setEditForm({ question: faq.question, answer: faq.answer, order: faq.order, active: faq.active });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">FAQs</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Manage frequently asked questions shown on the home page.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-md shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-brand-text">New FAQ</h2>
            <button onClick={() => setIsCreating(false)}><X className="w-5 h-5 text-brand-text-muted" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1">Question *</label>
              <input
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                className="w-full px-4 py-2 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="e.g. How long do dry fruits stay fresh?"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1">Answer *</label>
              <textarea
                rows={4}
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })}
                className="w-full px-4 py-2 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                placeholder="Provide a clear and helpful answer..."
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 border border-[#E8E6E1] rounded-xl text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-brand-primary"
                />
                <span className="text-sm font-bold text-brand-text">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-[#E8E6E1]">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-brand-text-muted hover:text-brand-text">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="px-6 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-primary-dark disabled:opacity-70 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">No FAQs yet. Add your first one above.</div>
        ) : (
          <ul className="divide-y divide-[#E8E6E1]">
            {faqs.map((faq) => (
              <li key={faq._id} className="p-5 hover:bg-brand-bg/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-brand-primary/60 uppercase tracking-widest">#{faq.order}</span>
                      {!faq.active && <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Inactive</span>}
                    </div>
                    <p className="font-bold text-brand-text mb-1 text-sm">{faq.question}</p>
                    <p className="text-sm text-brand-text-muted leading-relaxed line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => handleToggle(faq)} title={faq.active ? "Deactivate" : "Activate"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${faq.active ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                      {faq.active ? "Live" : "Off"}
                    </button>
                    <button onClick={() => openEdit(faq)} className="p-2 text-brand-text-muted hover:text-brand-primary hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(faq._id)} className="p-2 text-brand-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-xl w-full shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-brand-text">Edit FAQ</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-brand-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Question *</label>
                <input
                  value={editForm.question}
                  onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Answer *</label>
                <textarea
                  rows={5}
                  value={editForm.answer}
                  onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-text mb-1">Order</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.order}
                    onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border border-[#E8E6E1] rounded-xl text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input
                    type="checkbox"
                    checked={editForm.active}
                    onChange={e => setEditForm({ ...editForm, active: e.target.checked })}
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <span className="text-sm font-bold text-brand-text">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2 border-t border-[#E8E6E1]">
                <button onClick={() => setEditing(null)} className="flex-1 px-4 py-3 border border-[#E8E6E1] text-brand-text-muted font-bold rounded-xl hover:bg-gray-50">Cancel</button>
                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary-dark disabled:opacity-70 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
