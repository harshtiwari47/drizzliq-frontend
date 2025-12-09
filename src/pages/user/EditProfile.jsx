import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import PageLayout from "../../container/layouts/general";
import "./styles/profileEdit.css";

export default function EditProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    bio: user?.bio,
    website: user?.links?.website,
    github: user?.links?.github,
    twitter: user?.links?.twitter,
    instagram: user?.links?.instagram,
    linkedin: user?.links?.linkedin,
    avatarPreview: user?.avatarUrl,
    bannerPreview: user?.bannerUrl,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!mounted) return;
        setForm((s) => ({
          ...s,
          id: data.id || data._id || "",
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          bio: data.bio || "",
          website: data.links?.website || "",
          github: data.links?.github || "",
          twitter: data.links?.twitter || "",
          instagram: data.links?.instagram || "",
          linkedin: data.links?.linkedin || "",
          avatarPreview: data.avatarUrl || "",
          bannerPreview: data.bannerUrl || "",
        }));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (
      form.username &&
      (form.username.length < 3 || form.username.length > 30)
    )
      e.username = "Username must be 3–30 characters.";
    if (form.bio && form.bio.length > 300)
      e.bio = "Bio must be 300 characters or fewer.";
    if (form.password && form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        name: form.name,
        username: form.username,
        bio: form.bio,
        links: {
          website: form.website,
          github: form.github,
          twitter: form.twitter,
          instagram: form.instagram,
          linkedin: form.linkedin,
        },
        settings: { theme: form.theme, language: form.language },
        avatarUrl: form.avatarPreview || null,
        bannerUrl: form.bannerPreview || null,
      };
      if (form.password) payload.password = form.password;

      const res = await fetch("/api/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) setErrors(body.errors);
        else setErrors({ form: body.message || "Failed to save profile" });
        return;
      }

      const updated = await res.json();
      setForm((s) => ({
        ...s,
        avatarPreview: updated.avatarUrl || s.avatarPreview,
        bannerPreview: updated.bannerUrl || s.bannerPreview,
        password: "",
      }));
    } catch (err) {
      console.error(err);
      setErrors({ form: "Network error while saving" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading profile…</div>;

  const predefinedBanners = [
    { id: "b1", url: "https://picsum.photos/700/400" },
    { id: "b2", url: "https://picsum.photos/700/400" },
    { id: "b3", url: "https://picsum.photos/700/400" },
  ];
  const predefinedAvatars = [
    { id: "a1", url: "https://picsum.photos/200" },
    { id: "a2", url: "https://picsum.photos/200" },
    { id: "a3", url: "https://picsum.photos/200" },
  ];

  return (
    <PageLayout>
      <form className="editProf" onSubmit={handleSubmit}>
        <div className="pageTitle">
          <strong>Edit Profile</strong>
        </div>

        {errors.form && <div style={{ color: "red" }}>{errors.form}</div>}

        {/* Banner */}
        <label>Banner</label>
        <div className="bannerContainer">
          <div className="bannerPrev">
            {form.bannerPreview ? (
              <img src={form.bannerPreview} alt="banner" />
            ) : (
              <div>No banner</div>
            )}
          </div>

          <div className="preBannerList">
            {predefinedBanners.map((b) => (
              <img
                key={b.id}
                src={b.url}
                alt={b.id}
                onClick={() => setForm((s) => ({ ...s, bannerPreview: b.url }))}
                style={{
                  cursor: "pointer",
                  border:
                    form.bannerPreview === b.url
                      ? "2px solid black"
                      : "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>

        {/* Avatar and basic */}
        <label>Avatar</label>
        <div className="avatarContainer">
          <div className="avatarPrev">
            {form.avatarPreview ? (
              <img src={form.avatarPreview} alt="avatar" />
            ) : (
              <div>No avatar</div>
            )}
          </div>
          <div className="preAvatarList">
            {predefinedAvatars.map((a) => (
              <img
                key={a.id}
                src={a.url}
                alt={a.id}
                onClick={() => setForm((s) => ({ ...s, avatarPreview: a.url }))}
                style={{
                  cursor: "pointer",
                  border:
                    form.avatarPreview === a.url
                      ? "2px solid black"
                      : "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flexContainer">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </div>

          <div>
            <label>Email (read-only)</label>
            <input name="email" value={form.email} readOnly />
          </div>

          <div>
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <div style={{ color: "red" }}>{errors.username}</div>
            )}
          </div>

          <div>
            <a href="/reset-password">Change password</a>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
          />
          <div>{form.bio.length}/300</div>
          {errors.bio && <div style={{ color: "red" }}>{errors.bio}</div>}
        </div>

        {/* Links */}
        <div className="flexContainer">
          <div>
            <label>Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>GitHub</label>
            <input name="github" value={form.github} onChange={handleChange} />
          </div>

          <div>
            <label>Twitter</label>
            <input
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Instagram</label>
            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>LinkedIn</label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button type="button" className="clearBtn" onClick={() => window.location.reload()}>
            Cancel
          </button>
        </div>
      </form>
    </PageLayout>
  );
}
