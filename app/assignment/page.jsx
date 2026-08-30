"use client";

import { useState } from "react";

export default function AssignmentPage() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "/api/assignment",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setSuccess(false);

        setMessage(
          data.message ||
            "Assignment submission failed."
        );

        return;
      }

      setSuccess(true);
      setShowSuccessModal(true);

      form.reset();
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMessage(
        "Unable to submit your assignment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const maxSize =
      4 * 1024 * 1024;

    if (file.size > maxSize) {
      event.target.value = "";

      setSuccess(false);

      setMessage(
        "The file must be 4 MB or smaller."
      );
    }
  }

  return (
    <main className="min-h-screen  px-4 py-16">
      <div className="mx-auto max-w-xl">

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            HTML Assignment Submission
          </h1>

          <p className="mt-2 mb-8 text-gray-500">
            Enter your details and upload your assignment.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Student Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Student Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={100}
                placeholder="Enter your full name"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 text-gray-500"
              />
            </div>

            {/* Roll Number */}

            <div>
              <label
                htmlFor="rollNo"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Roll Number
              </label>

              <input
                id="rollNo"
                name="rollNo"
                type="number"
                required
                min="1"
                max="40"
                placeholder="Enter roll number"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 text-gray-500"
              />
            </div>

            {/* Optional URL */}

            <div>
              <label
                htmlFor="submissionUrl"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Project URL
                <span className="ml-1 text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="submissionUrl"
                name="submissionUrl"
                type="url"
                placeholder="https://github.com/..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                GitHub, Google Drive, deployed project,
                or another relevant link.
              </p>
            </div>

            {/* File Upload */}

            <div>
              <label
                htmlFor="file"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Assignment File
              </label>

              <input
                id="file"
                name="file"
                type="file"
                required
                onChange={handleFileChange}
                accept="
                  .txt,
                  .html,
                  .zip,
                  .rar,
                  text/plain,
                  text/html,
                  application/zip,
                  application/x-zip-compressed,
                  application/vnd.rar,
                  application/x-rar-compressed
                "
                className="w-full rounded-lg border px-4 py-3 text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                TXT, HTML, ZIP or RAR · Maximum 2 MB
              </p>
            </div>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-black
                py-3
                font-medium
                text-white
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Submitting..."
                : "Submit Assignment"}
            </button>

          </form>

          {/* Error Message (still inline) */}

          {message && !success && (
            <div
              className="
                mt-6
                rounded-lg
                p-4
                text-sm
                bg-red-50 text-red-700
              "
            >
              {message}
            </div>
          )}

        </div>
      </div>

      {/* Success Popup Modal */}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Submitted successfully !
            </h2>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="
                mt-6
                w-fit
                rounded-lg
                bg-black
                py-3
                px-8
                font-medium
                text-white
                transition
                hover:bg-gray-800
              "
            >
              OK
            </button>

          </div>
        </div>
      )}
    </main>
  );
}