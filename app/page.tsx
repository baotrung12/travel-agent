import Head from "next/head";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import PastTours from "@/app/components/PastTours";
import ToursForSale from "@/app/components/ToursForSale";
import PopularDestinations from "@/app/components/PopularDestinations";
import ContactForm from "@/app/components/ContactForm";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Travel Agent | Explore the World</title>
        <meta name="description" content="Book amazing trips and explore destinations worldwide with our travel agency." />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white pt-16">
        <Image
          src="/hcmc.jpg"
          alt="Travel background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-60"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-lg mb-6">Find the best destinations and travel packages tailored for you.</p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search destinations..."
              className="px-4 py-2 rounded-l-md text-black"
            />
            <button className="bg-blue-600 px-6 py-2 rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Past Tours Section */}
      <PastTours />

      <ToursForSale />

      <PopularDestinations />

      <ContactForm />

      <Footer />
    </>
  );
}
