import Image from "next/image";
import { Globe, ExternalLink } from "lucide-react";
import { PERSONAL_WEBSITES } from "@/constants/media-links";

export default function Website() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Websites</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERSONAL_WEBSITES.map((site, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={site.image || "/placeholder.svg"}
                alt={site.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{site.title}</h3>
              <p className="text-gray-600 mb-3">{site.description}</p>
              <a
                href={site.url}
                className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="mr-1">Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
