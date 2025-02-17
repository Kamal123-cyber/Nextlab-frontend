import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
          <Link href="/contact" className="hover:underline">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
