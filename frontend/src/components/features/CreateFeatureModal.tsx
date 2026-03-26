import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createFeatureSchema, type CreateFeatureInput } from "@/validations";
import { useUIStore } from "@/store/ui.store";
import { useCreateFeature } from "@/hooks/useFeatures";

export default function CreateFeatureModal() {
  const { isCreateModalOpen, closeCreateModal } = useUIStore();

  return (
    <AnimatePresence>
      {isCreateModalOpen && <ModalContent onClose={closeCreateModal} />}
    </AnimatePresence>
  );
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const createFeature = useCreateFeature();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateFeatureInput>({
    resolver: zodResolver(createFeatureSchema),
  });

  const titleValue = watch("title") ?? "";
  const descValue = watch("description") ?? "";

  function onSubmit(data: CreateFeatureInput) {
    createFeature.mutate(
      { title: data.title, description: data.description },
      {
        onSuccess: () => {
          closeModal();
          toast.success("Feature submitted! 🎉");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to submit feature.");
        },
      },
    );
  }

  function closeModal() {
    onClose();
    reset();
  }

  const isPending = createFeature.isPending || isSubmitting;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 49,
        }}
        onClick={closeModal}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: 480,
          maxWidth: "calc(100vw - 40px)",
          background: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 28,
          zIndex: 50,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Lightbulb size={18} style={{ color: "#6366f1", flexShrink: 0 }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18, flex: 1 }}>
            Suggest a Feature
          </span>
          <button
            onClick={closeModal}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              padding: 4,
              borderRadius: 6,
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "white")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.4)")
            }
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Title field */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Title
              </label>
              <span
                style={{
                  fontSize: 11,
                  color:
                    titleValue.length === 100
                      ? "#f87171"
                      : titleValue.length > 80
                        ? "#fbbf24"
                        : "rgba(255,255,255,0.3)",
                }}
              >
                {titleValue.length}/100
              </span>
            </div>
            <input
              {...register("title")}
              className="input-dark"
              placeholder="A concise feature title"
              maxLength={100}
            />
            {errors.title && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description field */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Description
              </label>
              <span
                style={{
                  fontSize: 11,
                  color:
                    descValue.length === 500
                      ? "#f87171"
                      : descValue.length > 400
                        ? "#fbbf24"
                        : "rgba(255,255,255,0.3)",
                }}
              >
                {descValue.length}/500
              </span>
            </div>
            <textarea
              {...register("description")}
              className="input-dark"
              placeholder="Describe the feature and why it's valuable..."
              maxLength={500}
              style={{ minHeight: 100, resize: "none", height: "auto" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            {errors.description && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isPending}
            style={{ width: "100%", height: 42 }}
          >
            {isPending ? "Submitting..." : "Submit Feature"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
