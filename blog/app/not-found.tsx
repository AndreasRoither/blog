import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex flex-col items-center justify-center min-h-[60vh] flex-grow">
				<h1 className="text-8xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">
					404
				</h1>

				<h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-6">
					Page Not Found
				</h2>

				<div className="w-24 h-1 bg-indigo-500 mb-8 rounded-full" />

				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
					Oops! The page you're looking for seems to have disapparated
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href="/"
						className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
					>
						Return Home
					</Link>

					<Link
						href="/posts"
						className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
					>
						Browse Posts
					</Link>
				</div>
			</div>

			<Footer />
		</div>
	);
}
