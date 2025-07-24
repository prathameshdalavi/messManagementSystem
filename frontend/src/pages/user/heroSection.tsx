

import dashboardImg from '../../assets/dashboard.png';
type HeroSectionProps = {
  searchRef: React.RefObject<HTMLDivElement | null>;
};
export const HeroSection = ({ searchRef }: HeroSectionProps) => {

     const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
    return (
      <section className="relative bg-gradient-to-br from-teal-50 to-white py-24 px-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-300 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-teal-200 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Effortless  <span className="text-teal-600"> Eating,</span> One Click Away.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Life at a professionally managed mess awaits you. Move in without having to pay a fortune.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={scrollToSearch} className="bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
                  Find Mess Near You
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src={dashboardImg}
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 "></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-teal-500 text-xl">🏆</span>
                  </div>
                  <div>
                    <div className="text-teal-600 font-bold text-xl">50,000+</div>
                    <div className="text-gray-600 text-sm">Happy Diners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};