"use client";

import React, { useState } from "react";
import { X, Upload, CheckCircle, Loader2 } from "lucide-react";
import { submitRenewal } from "@/lib/api";

interface RenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function RenewalModal({ isOpen, onClose, title }: RenewalModalProps) {
  const [step, setStep] = useState(1);
  const [transactionId, setTransactionId] = useState("");
  const [transactionImage, setTransactionImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransactionImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!transactionId.trim()) {
      setError("Please enter the transaction ID");
      return;
    }
    if (!transactionImage) {
      setError("Please upload the payment screenshot");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("transaction_id", transactionId);
      formData.append("transaction_image", transactionImage);

      await submitRenewal(formData);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to submit renewal request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-md text-sm text-orange-800 mb-6">
                Please transfer the renewal fee to the UPHA bank account and upload the transaction details below.
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Transaction ID / UTR</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter transaction reference number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Screenshot</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-full px-4 py-3 bg-gray-50 border-2 border-dashed rounded-md flex items-center justify-center gap-2 transition-colors ${transactionImage ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-300 text-gray-500 hover:border-orange-500 hover:bg-orange-50'}`}>
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {transactionImage ? transactionImage.name : "Click or drag file to upload"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#d97c55] hover:bg-[#c26a45] text-white rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Renewal"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Submitted Successfully</h3>
              <p className="text-gray-500 mb-6">
                Your renewal request and payment details have been sent to the admin for verification.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
