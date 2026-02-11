"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import PredictionForm from "@/components/predictions/PredictionForm";
import CouponForm from "@/components/predictions/CouponForm";

export default function CreatePredictionPage() {
  const t = useTranslations("predictions");
  const [activeTab, setActiveTab] = useState<"single" | "coupon">("single");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("createPrediction")}</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("single")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors",
            activeTab === "single"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-400 hover:text-dark-200"
          )}
        >
          <FileText className="w-4 h-4" />
          {t("singleMatch")}
        </button>
        <button
          onClick={() => setActiveTab("coupon")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors",
            activeTab === "coupon"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-400 hover:text-dark-200"
          )}
        >
          <Layers className="w-4 h-4" />
          {t("coupon")}
        </button>
      </div>

      <div className="card p-6">
        {activeTab === "single" ? <PredictionForm /> : <CouponForm />}
      </div>
    </div>
  );
}
