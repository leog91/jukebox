export default function Notification({
  message,
  success,
}: {
  message: string;
  success: boolean;
}) {
  return (
    <div
      aria-live="polite"
      className={`mb-4 rounded-md px-3 py-2 text-sm font-medium ${
        success
          ? "bg-green-950 text-green-300"
          : "bg-red-950 text-red-300"
      }`}
    >
      {message}
    </div>
  );
}
