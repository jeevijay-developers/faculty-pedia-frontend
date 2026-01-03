"use client";

import Link from "next/link";
import Image from "next/image";
import { RiAppleFill, RiAndroidFill, RiDownload2Line } from "react-icons/ri";
import { motion } from "framer-motion";

const MobileAppAdSection = () => {
  return (
    <section className="bg-gray-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - App Description */}
          <motion.div
            className="order-2 lg:order-1 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              Facultypedia connects students and educators in one powerful
              platform
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Enabling seamless learning, resource sharing, communication, and
              collaboration anytime, anywhere. Smart tools for smarter
              classrooms and growth.
            </p>

            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link
                  href="#"
                  className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto justify-center"
                >
                  <RiAppleFill className="text-xl" />
                  <div className="flex flex-col">
                    <span className="text-xs">Download on the</span>
                    <span className="font-semibold">App Store</span>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto justify-center"
                >
                  <RiAndroidFill className="text-xl" />
                  <div className="flex flex-col">
                    <span className="text-xs">Get it on</span>
                    <span className="font-semibold">Google Play</span>
                  </div>
                </Link>
              </div>

              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  <span>Coming Soon...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - App Image */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center items-center relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-full max-w-md">
              <div className="relative h-104 w-full overflow-hidden">
                <Image
                  src="/images/Home/MobileApp.png"
                  alt="Facultypedia Mobile App"
                  fill
                  className="object-contain bg-transparent"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppAdSection;
