"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const td = useTranslations("disclaimer");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    preferredLanguage: "az",
    ageVerified: false,
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.ageVerified) {
      setError("Age verification required");
      return;
    }
    if (!formData.termsAccepted) {
      setError("Terms must be accepted");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          preferredLanguage: formData.preferredLanguage,
          ageVerified: formData.ageVerified,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-500 mb-2">
          PredictPro
        </h1>
        <p className="text-dark-400">{t("registerTitle")}</p>
      </div>

      {error && (
        <div className="bg-loss/10 border border-loss/30 text-loss rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("name")}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("password")}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => update("password", e.target.value)}
            className="input-field"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("dateOfBirth")}
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">
            {t("languagePreference")}
          </label>
          <select
            value={formData.preferredLanguage}
            onChange={(e) => update("preferredLanguage", e.target.value)}
            className="input-field"
          >
            <option value="az">Azərbaycan dili</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.ageVerified}
            onChange={(e) => update("ageVerified", e.target.checked)}
            className="mt-1 w-4 h-4 accent-primary-500"
            required
          />
          <span className="text-sm text-dark-300">{t("ageVerification")}</span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => update("termsAccepted", e.target.checked)}
            className="mt-1 w-4 h-4 accent-primary-500"
            required
          />
          <span className="text-sm text-dark-300">{t("termsAccept")}</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? "..." : t("registerButton")}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-dark-400">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-primary-400 hover:underline">
          {t("loginButton")}
        </Link>
      </div>

      <div className="mt-6 pt-4 border-t border-dark-700">
        <p className="text-xs text-dark-500 text-center">{td("text")}</p>
      </div>
    </div>
  );
}
