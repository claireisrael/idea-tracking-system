"use client";

export default function SuccessModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "450px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          transform: "scale(1)",
          animation: "modalAppear 0.3s ease-out",
          border: "3px solid #51cf66",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #51cf66 0%, #40c057 100%)",
            margin: "0 auto 20px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            color: "white",
            animation: "bounce 0.6s ease-in-out",
          }}
        >
          ✓
        </div>

        {/* Title */}
        <h2
          style={{
            margin: "0 0 15px 0",
            color: "#2d3748",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          {title || "Success!"}
        </h2>

        {/* Message */}
        <p
          style={{
            margin: "0 0 30px 0",
            color: "#718096",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {message || "Your action was completed successfully."}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #51cf66 0%, #40c057 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "15px 30px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 15px rgba(81, 207, 102, 0.3)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(81, 207, 102, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(81, 207, 102, 0.3)";
          }}
        >
          Awesome! 🎉
        </button>
      </div>

      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: scale(1);
          }
          40%,
          43% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1.05);
          }
          90% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
