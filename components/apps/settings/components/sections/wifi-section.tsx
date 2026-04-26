import { WIFI_DETAILS } from "../../content";

interface WifiSectionProps {
  cardBg: string;
  secondaryText: string;
  wifiEnabled: boolean;
  wifiStatusTone: string;
  wifiStatusLabel: string;
  wifiSignal: string;
  onWifiToggle: () => void;
}

export function WifiSection({
  cardBg,
  secondaryText,
  wifiEnabled,
  wifiStatusTone,
  wifiStatusLabel,
  wifiSignal,
  onWifiToggle,
}: WifiSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Wi-Fi</h2>

      <div className="space-y-6">
        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium">Current Network</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${wifiStatusTone}`}
                >
                  {wifiStatusLabel}
                </span>
              </div>
              <p className={`mt-2 text-sm ${secondaryText}`}>
                {wifiEnabled
                  ? "Connected and using the active wireless interface."
                  : "Turn Wi-Fi on to discover nearby networks and restore connectivity."}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wifiEnabled}
                onChange={onWifiToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Network Name</span>
              <span className="font-medium">
                {wifiEnabled
                  ? WIFI_DETAILS.connectedNetworkName
                  : "Not connected"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Status</span>
              <span className="font-medium">{wifiStatusLabel}</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Security</span>
              <span className="font-medium">
                {wifiEnabled ? WIFI_DETAILS.security : "Unavailable"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Signal</span>
              <span className="font-medium">{wifiSignal}</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3 md:col-span-2">
              <span className={secondaryText}>PHY Mode</span>
              <span className="font-medium">
                {wifiEnabled ? WIFI_DETAILS.standard : "No wireless link"}
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <h3 className="text-lg font-medium">TCP/IP</h3>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>IPv4 Address</span>
              <span className="font-medium">
                {wifiEnabled ? WIFI_DETAILS.ipAddress : "--"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Router</span>
              <span className="font-medium">
                {wifiEnabled ? WIFI_DETAILS.router : "--"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3 md:col-span-2">
              <span className={secondaryText}>DNS Servers</span>
              <span className="text-right font-medium">
                {wifiEnabled ? WIFI_DETAILS.dns : "--"}
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <h3 className="text-lg font-medium">Hardware</h3>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Wi-Fi Address</span>
              <span className="font-medium">{WIFI_DETAILS.macAddress}</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Private Wi-Fi Address</span>
              <span className="font-medium">{WIFI_DETAILS.privateAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
