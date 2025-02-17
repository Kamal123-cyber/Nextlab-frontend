import Link from "next/link";

export default function Home() {
  return (
    <main className="text-gray-900">
      {/* Hero Section */}
 
     

      {/* Call-to-Action */}
      <section className="py-16 text-black text-center">
        <h2 className="text-3xl font-bold">Join Us - Today</h2>
        <p className="mt-2 text-lg">Sign up now and explore the future with us.</p>
        <Link href="/signup">
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
        Get Started
        </button> 
        </Link>
      </section>
    </main>
  );
}
