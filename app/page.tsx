import Head from "next/head";
import Navbar from "@/app/components/Navbar";
import PastTours from "@/app/components/PastTours";
import ToursForSale from "@/app/components/ToursForSale";
import PopularDestinations from "@/app/components/PopularDestinations";
import ContactForm from "@/app/components/ContactForm";
import Footer from "@/app/components/Footer";
import FullHeightSlider from "@/app/components/GallerySlider";

export default function Home() {
  return (
    <>
      <Head>
        <title>Edutour | Du lịch giáo dục</title>
        <meta name="description"
              content="Book amazing trips and explore destinations worldwide with our travel agency."/>
      </Head>

      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}

      <FullHeightSlider />

      <ToursForSale/>

      {/* Past Tours Section */}
      <PastTours/>

      <PopularDestinations/>

      <ContactForm/>

      <Footer/>
    </>
  );
}
