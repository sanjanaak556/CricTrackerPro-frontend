import Lottie from "lottie-react";
import ballAnimation from "../assets/lottie/Cricket bowled out.json";
import banner from "../assets/banner.jpg";

export default function Hero() {
    return (
        <section className="w-full">

            {/* Banner Section */}
            <div
                className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Text Content */}
                <div className="relative text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl">
                        Track Cricket Like Never Before
                    </h1>

                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-90">
                        Real-time scoring, live match updates & advanced analytics.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-6 mt-8 justify-center">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg cursor-pointer">
                            Start Scoring
                        </button>

                        <button className="px-8 py-3 border border-white text-white rounded-lg text-lg hover:bg-white hover:text-black transition shadow-lg cursor-pointer">
                            Watch Live Matches
                        </button>
                    </div>
                </div>
            </div>

            {/* Lottie Animation Below Banner */}
            <div className="mt-10 flex justify-center">
                <div className="w-64 md:w-96">
                    <Lottie animationData={ballAnimation} loop={true} />
                </div>
            </div>
        </section>
    );
}