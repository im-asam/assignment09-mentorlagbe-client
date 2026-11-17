"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { getMyProfile, updateMyProfile } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import ImageUpload from "@/components/ImageUpload";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

function ProfileContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    let alive = true;
    getMyProfile()
      .then((p) => {
        if (!alive) return;
        setName(p.name ?? "");
        setPhone(p.phone ?? "");
        setBio(p.bio ?? "");
        setImage(p.image ?? "");
        setEmail(p.email ?? "");
        setRole(p.role ?? "");
        setPlan(p.plan ?? "free");
      })
      .catch(() => {
        // Server profile not reachable — fall back to session data so the
        // form still works for name/image via the session user.
        if (!alive) return;
        const u = session?.user as
          | { name?: string; email?: string; image?: string | null; role?: string; plan?: string }
          | undefined;
        setName(u?.name ?? "");
        setEmail(u?.email ?? "");
        setImage(u?.image ?? "");
        setRole(u?.role ?? "");
        setPlan(u?.plan ?? "free");
        toast.error("Couldn't load your saved profile — showing session info.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        image: image.trim(),
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading your profile…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Update Profile
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Keep your info fresh — tutors see your name and bio on listings.
      </p>

      <div className="mt-6 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm sm:p-8 dark:border-brand-900 dark:bg-[#1c1a18]">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-brand-700 dark:bg-brand-900/70 dark:text-brand-300">
            {email}
          </span>
          {role && (
            <span className="rounded-full bg-violet-50 px-3 py-1.5 capitalize text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {role}
            </span>
          )}
          <span className="rounded-full bg-amber-50 px-3 py-1.5 capitalize text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {plan} plan
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <ImageUpload
            value={image}
            onChange={setImage}
            label="Profile Picture"
            hint="Upload a square photo (JPG/PNG) or paste an image URL."
          />

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Full Name *
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01700-000000"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="A short intro — subjects you teach or want to learn, experience, goals…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
