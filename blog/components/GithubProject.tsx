import Image from "next/image";

interface GithubProjectProps {
  name: string;
  url: string;
  description?: string;
}

export default function GithubProject({ name, url, description }: GithubProjectProps) {
  return (
    <div className="mb-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4 py-2 hover:shadow-md transition-shadow">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 hover:no-underline"
      >
        <Image
          className="transition-transform duration-150 hover:scale-110"
          alt="GitHub"
          src="/svg/github.svg"
          width={48}
          height={48}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-lg hover:text-blue-600 transition-colors">
            {name}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}
