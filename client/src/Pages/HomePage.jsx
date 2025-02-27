import { Link } from 'react-router-dom';
import HomePageImage from '../Assets/Images/homePageMainImage.png';
import HomeLayout from '../Layouts/HomeLayout';

function HomePage() {
  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-10 px-8 lg:px-16 text-white">
        {/* Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Elevate Your Skills with
            <span className="text-yellow-500"> RealEvals</span>
          </h1>
          <p className="text-lg text-gray-300">Test Agents with ease</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/courses">
              <button className="bg-yellow-500 px-6 py-3 rounded-md font-semibold text-lg transition hover:bg-yellow-600">
                Explore Tasks
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-yellow-500 px-6 py-3 rounded-md font-semibold text-lg transition hover:bg-yellow-600">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center">
          <img alt="homepage" src={HomePageImage} className="max-w-xs lg:max-w-sm drop-shadow-lg" />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
