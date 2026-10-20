export default function TelegramContactButton() {
  return (
    <a
      href="https://t.me/ibb_07n"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram orqali bog‘lanish"
      title="Telegram orqali bog‘lanish"
      className="fixed bottom-4 right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-xl transition hover:scale-105 hover:bg-[#168ac4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17375e] sm:bottom-6 sm:right-6"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-7 fill-current"
      >
        <path d="M23.5 3.2c.2-.9-.7-1.6-1.6-1.2L2.1 9.5c-1 .4-.9 1.8.1 2.1l5.2 1.6 2 6.2c.3 1 1.6 1.2 2.2.4l2.9-3.5 5.6 4.1c.8.6 1.9.2 2.1-.8L23.5 3.2ZM9.2 12.8l10.2-6.3-8.3 7.9-.3 3.6-1.6-5.2Z" />
      </svg>
    </a>
  );
}
