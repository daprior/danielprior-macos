interface NotificationsSectionProps {
  cardBg: string;
  secondaryText: string;
  onPreviewNotification: () => void;
  onOpenContactApp: () => void;
  onSnakePreview: () => void;
}

export function NotificationsSection({
  cardBg,
  secondaryText,
  onPreviewNotification,
  onOpenContactApp,
  onSnakePreview,
}: NotificationsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>

      <div className="space-y-6">
        <div className={`${cardBg} p-5 rounded-xl space-y-3`}>
          <h3 className="text-lg font-medium">Contact Alerts</h3>
          <p className={`text-sm ${secondaryText}`}>
            Preview the same contact notification that appears after login.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPreviewNotification}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
            >
              Show Preview
            </button>
            <button
              type="button"
              onClick={onOpenContactApp}
              className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
            >
              Open Contact
            </button>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-3`}>
          <h3 className="text-lg font-medium">Snake Alerts</h3>
          <p className={`text-sm ${secondaryText}`}>
            Snake uses the same system notifications and fires one when you
            beat your saved high score.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSnakePreview}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"
            >
              Show Snake Preview
            </button>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <h3 className="text-lg font-medium">How It Works</h3>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Login notification</span>
              <span className="font-medium">Enabled</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Action button</span>
              <span className="font-medium">Opens Contact</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Snake high score</span>
              <span className="font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
